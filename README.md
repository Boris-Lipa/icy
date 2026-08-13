# Samo polako

A practical Serbian course for English speakers. This repository is configured to publish automatically with GitHub Pages.

## Local development

Requirements: Node.js 22+ and pnpm 11.

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

The static site is generated in `dist/`.

## Generate Serbian audio

The site plays checked-in MP3 files instead of relying on browser voices. To
generate them with the Azure Speech Free F0 resource:

1. Copy `.env.example` to `.env.local`.
2. In Azure, open the Speech resource and select **Keys and Endpoint**.
3. Put either key in `AZURE_SPEECH_KEY` and confirm the region is
   `swedencentral`. Never commit or share `.env.local`.
4. Preview the configured clips without using Azure quota:

   ```bash
   node scripts/generate-serbian-audio.mjs --dry-run
   ```

5. Generate one test clip and listen to
   `public/audio/serbian/nikola-introduction.mp3`:

   ```bash
   node scripts/generate-serbian-audio.mjs --only nikola-introduction --force
   ```

6. Generate the remaining MP3 files:

   ```bash
   node scripts/generate-serbian-audio.mjs
   ```

Existing files are skipped. Use `node scripts/generate-serbian-audio.mjs --force` only when you
intentionally want to regenerate every clip after changing the voice or text.
The generated MP3 files belong in Git so GitHub Pages can serve them without
calling Azure from the browser.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages** in the GitHub repository.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` or `master`, or run the workflow manually from **Actions**.

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the site. It supports both project URLs such as `https://username.github.io/repository/` and custom domains.

## Current storage behavior

The learner's name, lesson position, and completion status are stored in that browser using `localStorage`. There is no database, account system, analytics, or external API, so progress does not sync between devices.
