# Fun Souls

A travel memory website built with **Next.js** and **Tailwind CSS**. Each trip and crew member has its own content folder — add photos by dropping files in, no code changes needed.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

[https://a-fun-souls.vercel.app/](https://a-fun-souls.vercel.app/)

## Build & deploy (Vercel)

```bash
npm run build
```

The site exports to static files in `out/`. Connect this repo to [Vercel](https://vercel.com) — it will detect Next.js automatically.

To change the featured trip on the homepage, edit `content/site.yaml`:

```yaml
featuredTrip: cebu-2026
```

## Project structure

```
content/                  # Text & metadata (YAML + Markdown)
public/photos/            # All images
src/app/                  # Pages
src/components/           # UI components
src/lib/content.ts        # Content loader (build time)
```

See **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** for how to add trips, photos, and crew profiles.

## Placeholder images

Images in this demo are generated placeholders, not real trip photos. Replace the files under `public/photos/` with your own photos.


## Requirements

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full spec and confirmed decisions.
