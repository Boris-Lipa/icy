import audioManifest from "./serbian-audio.json";

const clipsByText = new Map<string, string>();

for (const clip of audioManifest.clips) {
  clipsByText.set(clip.text, clip.file);
  for (const alias of clip.aliases ?? []) clipsByText.set(alias, clip.file);
}

let activeAudio: HTMLAudioElement | null = null;

export function playSerbianAudio(text: string) {
  const file = clipsByText.get(text);

  if (!file) {
    console.warn(`No recorded Serbian audio clip is registered for: ${text}`);
    return;
  }

  activeAudio?.pause();
  if (activeAudio) activeAudio.currentTime = 0;

  const audioUrl = `${import.meta.env.BASE_URL}audio/serbian/${file}`;
  activeAudio = new Audio(audioUrl);
  activeAudio.play().catch((error: unknown) => {
    console.error(`Unable to play Serbian audio clip: ${audioUrl}`, error);
  });
}
