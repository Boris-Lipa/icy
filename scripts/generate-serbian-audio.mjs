import { existsSync } from "node:fs";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, "src", "audio", "serbian-audio.json");
const outputDirectory = path.join(projectRoot, "public", "audio", "serbian");

function loadLocalEnvironment(contents) {
  for (const sourceLine of contents.split(/\r?\n/u)) {
    const line = sourceLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const localEnvironmentPath = path.join(projectRoot, ".env.local");
if (existsSync(localEnvironmentPath)) {
  loadLocalEnvironment(await readFile(localEnvironmentPath, "utf8"));
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const onlyClipId = readOption("--only");
const shouldOverwrite = process.argv.includes("--force");
const isDryRun = process.argv.includes("--dry-run");

if (process.argv.includes("--help")) {
  console.log(`Generate the Serbian lesson MP3 files with Azure Speech.

Usage:
  pnpm audio:generate
  pnpm audio:generate -- --only zdravo
  pnpm audio:generate -- --force
  pnpm audio:generate -- --dry-run
  node scripts/generate-serbian-audio.mjs --clean

Credentials are read from AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in the
environment or from a gitignored .env.local file.`);
  process.exit(0);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const voice = process.env.AZURE_SPEECH_VOICE || manifest.voice;
const language = manifest.language;
const speechRate = Number(manifest.speechRate ?? 1);
const outputFormat = manifest.outputFormat;
const region = process.env.AZURE_SPEECH_REGION;
const speechKey = process.env.AZURE_SPEECH_KEY;

const selectedClips = onlyClipId
  ? manifest.clips.filter((clip) => clip.id === onlyClipId)
  : manifest.clips;

async function cleanObsoleteFiles() {
  for (const file of manifest.obsoleteFiles || []) {
    if (path.basename(file) !== file || path.extname(file).toLowerCase() !== ".mp3") {
      throw new Error(`Unsafe obsolete audio filename in manifest: ${file}`);
    }
    const obsoletePath = path.join(outputDirectory, file);
    if (existsSync(obsoletePath)) {
      await unlink(obsoletePath);
      console.log(`Removed obsolete clip: ${file}`);
    }
  }
}

if (process.argv.includes("--clean")) {
  await mkdir(outputDirectory, { recursive: true });
  await cleanObsoleteFiles();
  process.exit(0);
}

if (onlyClipId && selectedClips.length === 0) {
  throw new Error(`Unknown audio clip id: ${onlyClipId}`);
}

if (isDryRun) {
  console.log(`Voice: ${voice}`);
  console.log(`Speech rate: ${speechRate}`);
  console.log(`Region: ${region || "(not configured)"}`);
  for (const clip of selectedClips) {
    const clipVoice = clip.voice || voice;
    const clipRate = Number(clip.speechRate ?? speechRate);
    const tuning = clipVoice !== voice || clipRate !== speechRate ? ` [${clipVoice}, rate ${clipRate}]` : "";
    console.log(`${clip.id} -> ${clip.file}${tuning}: ${clip.synthesisText || clip.text}`);
  }
  process.exit(0);
}

if (!speechKey || !region) {
  throw new Error(
    "Azure Speech is not configured. Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION to .env.local first.",
  );
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSsml(clip) {
  const clipVoice = clip.voice || voice;
  const clipRate = Number(clip.speechRate ?? speechRate);
  const content = clip.parts
    ? clip.parts
        .map((part) => {
          const pause = part.pauseAfterMs ? `<break time="${Number(part.pauseAfterMs)}ms"/>` : "";
          return `${escapeXml(part.text)}${pause}`;
        })
        .join(" ")
    : escapeXml(clip.synthesisText || clip.text);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}"><voice name="${escapeXml(clipVoice)}"><prosody rate="${clipRate}"><s>${content}</s></prosody></voice></speak>`;
}

async function generateClip(clip) {
  const outputPath = path.join(outputDirectory, clip.file);
  if (!shouldOverwrite && existsSync(outputPath)) {
    console.log(`Skipped ${clip.id} (already exists)`);
    return;
  }

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/ssml+xml",
      "Ocp-Apim-Subscription-Key": speechKey,
      "User-Agent": "samo-polako-audio-generator",
      "X-Microsoft-OutputFormat": outputFormat,
    },
    body: createSsml(clip),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Azure could not generate ${clip.id} (${response.status}): ${responseText}`);
  }

  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));
  try {
    if (existsSync(outputPath)) await unlink(outputPath);
    await rename(temporaryPath, outputPath);
  } catch (error) {
    if (existsSync(temporaryPath)) await unlink(temporaryPath);
    throw error;
  }
  console.log(`Generated ${clip.id} -> ${path.relative(projectRoot, outputPath)}`);
}

await mkdir(outputDirectory, { recursive: true });
await cleanObsoleteFiles();
for (const clip of selectedClips) await generateClip(clip);
console.log(`Done. ${selectedClips.length} clip${selectedClips.length === 1 ? "" : "s"} checked.`);
