# Content Guide — Fun Souls

All site copy is **English**. Content is file-based: edit YAML/Markdown and add images to folders.

---

## Site-wide settings

**`content/site.yaml`**

| Field | Purpose |
|-------|---------|
| `featuredTrip` | Slug of the trip whose hero photos appear on the homepage |
| `tagline` | Short line under the site title on the homepage |

---

## Adding a new trip

### 1. Register the trip

Add the slug to **`content/trips/index.yaml`**:

```yaml
- cebu-2026
- japan-2027   # new trip
```

### 2. Create trip metadata

Create **`content/trips/japan-2027/trip.yaml`**:

```yaml
title: Japan Autumn 2027
location: Tokyo & Kyoto, Japan
startDate: "2027-11-01"
endDate: "2027-11-10"
coverImage: /photos/trips/japan-2027/hero/01.jpg
coverFocus: center 70%   # optional — crop position on trip cards & trip page banner
heroImages:
  - src: /photos/trips/japan-2027/hero/01.jpg
    focus: center 70%   # optional — shifts crop for object-cover
  - /photos/trips/japan-2027/hero/02.jpg
participants:
  - f1
  - f3
  - f7
description: One-line summary for cards and SEO.
```

Paths under `coverImage`, `heroImages` must start with `/photos/...` and point to files in **`public/photos/`**.

**Cover photo (`coverImage`):** Shown on the homepage Featured trip card and the trip detail banner. Change the path to use a different file, e.g. `/photos/trips/cebu-2026/hero/03.jpg`.

**Cover crop (`coverFocus`):** Same as carousel `focus` — increase the percentage to move subjects up on screen (try `65%`–`80%`).

**Carousel crop (`focus`):** If people or subjects are cut off, add `focus: center 72%` on that slide. Increase the percentage to move the visible area downward in the photo (subjects move up on screen). Try `60%`–`80%`; default is `center center` (50%).

### 3. Write the overview

Create **`content/trips/japan-2027/overview.md`** — plain paragraphs separated by blank lines.

### 4. Add photos

```
public/photos/trips/japan-2027/
├── hero/              # Homepage slideshow (featured trip only)
│   ├── 01.jpg
│   └── 02.jpg
└── gallery/           # Trip page gallery
    ├── day-1-tokyo/   # Optional subfolder → grouped section
    │   ├── 01.jpg
    │   └── 02.jpg
    └── day-2-kyoto/
        └── 01.jpg
```

- **Hero folder:** Curated best shots (5–15 recommended).
- **Gallery folder:** All trip photos. Subfolders become labeled sections (e.g. `day-1-cebu` → “Day 1 Cebu”). Files directly in `gallery/` appear under “General”.
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`, `.svg`
- Files are sorted alphabetically — use `01.jpg`, `02.jpg`, … for order.

### 5. (Optional) Set as featured trip

In **`content/site.yaml`**, set `featuredTrip: japan-2027`.

---

## Cebu 2026 (first trip)

| Item | Location |
|------|----------|
| Metadata | `content/trips/cebu-2026/trip.yaml` |
| Overview | `content/trips/cebu-2026/overview.md` |
| Hero photos | `public/photos/trips/cebu-2026/hero/` |
| Gallery | `public/photos/trips/cebu-2026/gallery/` |

Gallery subfolders (after import):

- `part-1` — LINE album 1 (137 photos)
- `part-2` — LINE album 2 (69 photos)
- `food` — hot pot (2 photos)

Rename or split into `day-1-cebu`, etc. anytime; the site reads folder names as section titles.

Replace placeholder SVGs with your real photos (keep the same names or update `trip.yaml` paths).

### Re-import from your photo folder

If photos live in `~/Pictures/Cebu-2026-trip` (LINE album exports), run:

```bash
python3 scripts/import-cebu-photos.py
```

This will:

- Copy all JPGs into `public/photos/trips/cebu-2026/gallery/` grouped as **part-1**, **part-2**, and **food**
- Build a 10-photo **hero** slideshow (largest / most varied shots)
- Resize images to max 2000px edge for faster loading
- Set temporary **member avatars** (one trip photo each until you assign real portraits)

To reorganize by day (e.g. `day-1-cebu`), move files between subfolders under `gallery/` manually — the site picks up folder names automatically.

Current Cebu gallery layout after import:

| Folder | Source | Count |
|--------|--------|-------|
| `part-1` | LINE album “Travel photos” | 137 |
| `part-2` | LINE album “Travel photos 2” | 69 |
| `food` | LINE album “Taiwanese hot pot” | 2 |

---

## Crew members (F1–F11)

Each member lives in **`content/members/f1/`** … **`content/members/f11/`**.

### Member metadata — `member.yaml`

```yaml
alias: F1
displayName: Alex        # optional — shown below alias when set
tagline: Always scouting the best sunset spot.
avatar: /photos/members/f1/avatar.jpg
externalVideos:              # optional — YouTube, Vimeo, or direct .mp4 links
  - https://www.youtube.com/watch?v=VIDEO_ID
  - https://youtu.be/VIDEO_ID
```

### Bio — `bio.md`

Short English bio, plain paragraphs.

### Personal videos (optional)

**Local files** — drop into folder (shown before Photos; section hidden if empty):

```
public/videos/members/f1/
├── 01.mp4
├── 02.mp4
└── ...
```

Supported formats: `.mp4`, `.webm`, `.mov`, `.m4v`. Prefer **MP4 (H.264)** for phones. Keep each file under ~50MB when possible.

**External links** — add to `member.yaml` as `externalVideos` (YouTube, Vimeo, or direct video URL). Local videos appear first, then external links in list order.

### Personal photos

```
public/photos/members/f1/
├── avatar.jpg    # Profile only — not shown in the photo gallery
├── 01.jpg
├── 02.jpg
└── ...
```

Register new members in **`content/members/index.yaml`**.

---

## Checklist: replace placeholders with real content

- [ ] Copy trip photos into `public/photos/trips/cebu-2026/hero/` and `gallery/`
- [ ] Update `content/trips/cebu-2026/overview.md` with your story
- [ ] For each member: avatar + photos in `public/photos/members/fN/`; optional videos in `public/videos/members/fN/` or `externalVideos` in `member.yaml`
- [ ] Edit `content/members/fN/bio.md` and optional `displayName` in `member.yaml`
- [ ] Run `npm run dev` locally to preview
- [ ] Deploy to Vercel

---

## Tips

- **Image size:** Resize large camera originals to ~2000px wide before upload for faster loads.
- **Naming:** Use lowercase slugs for folders (`cebu-2026`, not `Cebu 2026`).
- **No database:** Everything is in git — commit new photos and content together.
- **Rebuild:** After adding content, push to Vercel (or run `npm run build` locally) to publish changes.
