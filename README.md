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

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages** in the GitHub repository.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` or `master`, or run the workflow manually from **Actions**.

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the site. It supports both project URLs such as `https://username.github.io/repository/` and custom domains.

## Current storage behavior

The learner's name, lesson position, and completion status are stored in that browser using `localStorage`. There is no database, account system, analytics, or external API, so progress does not sync between devices.
