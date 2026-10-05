# Fun Souls — Requirements Document

**Version:** 1.0  
**Status:** Confirmed — development in progress  
**Language:** English (site content)

---

## 1. Overview

**Fun Souls** is a personal travel memory website for a friend group. The first trip to document is the **Cebu & nearby islands** trip (11 travelers, many photos). The site should feel like a warm photo album and travel journal, not a generic gallery.

The architecture must support **multiple trips over time**, with each trip’s photos and content kept separate and easy to extend.

---

## 2. Goals

| Goal | Description |
|------|-------------|
| **Showcase memories** | Highlight trip photos on the homepage with a rotating slideshow |
| **Celebrate the group** | Dedicated section for each of the 11 members (F1–F11) with avatar, bio, and personal photos |
| **Scale over time** | Add new trips without restructuring the site |
| **Easy content updates** | Non-developers can add photos and text with minimal friction |
| **English-only** | All UI labels, copy, and default content in English |

---

## 3. Users & Use Cases

**Primary audience:** The 11 travelers and their friends/family viewing shared memories.

| Use case | Description |
|----------|-------------|
| Browse homepage | See rotating hero photos and get a sense of the latest or featured trip |
| Explore a trip | View trip overview, timeline/highlights, and full photo gallery |
| Meet the crew | Browse F1–F11 profiles with avatars, short bios, and personal photo sets |
| Add content (maintainers) | Drop new photos or edit YAML/Markdown without touching layout code |

---

## 4. Site Structure

```
Fun Souls
├── Home                    # Hero slideshow + featured trip + quick links
├── Trips                   # List of all trips (past & future)
│   └── Trip detail         # e.g. "Cebu 2026"
│       ├── Overview        # Title, dates, location, summary
│       ├── Gallery         # Full photo grid / lightbox
│       └── (optional) Highlights / day notes
└── The Crew                # All 11 members across trips
    └── Member profile      # F1–F11 individual page
```

**Navigation (proposed):**

- Home
- Trips
- The Crew
- (Footer: site name, copyright, optional social links)

---

## 5. Functional Requirements

### 5.1 Homepage

| ID | Requirement | Priority |
|----|-------------|----------|
| H-1 | Full-width **photo carousel/slideshow** on the hero section | Must |
| H-2 | Auto-advance with configurable interval (e.g. 4–6 seconds) | Must |
| H-3 | Manual prev/next controls and pause on hover | Should |
| H-4 | Featured trip card (Cebu 2026 as default until more trips exist) | Must |
| H-5 | Short tagline introducing **Fun Souls** | Should |
| H-6 | Link to The Crew section | Should |

**Slideshow photo source:** Curated “hero” set from the active/featured trip (not every gallery photo).

### 5.2 Trips

| ID | Requirement | Priority |
|----|-------------|----------|
| T-1 | **Trips index page** listing all trips (title, cover image, date range, location) | Must |
| T-2 | Each trip has its **own folder** and isolated content | Must |
| T-3 | Trip detail page: title, dates, location, short description | Must |
| T-4 | Trip photo gallery with grid layout and **lightbox** (click to enlarge, swipe/keyboard nav) | Must |
| T-5 | Optional trip metadata: participant list (F1–F11 subset who joined), highlight captions | Should |
| T-6 | New trips added by creating a new content folder + one index entry (no code changes) | Must |

**First trip (seed content):**

- **Slug:** `cebu-2026` (proposed)
- **Title:** e.g. *Cebu & Island Hopping 2026*
- **Location:** Cebu, Philippines & nearby islands
- **Group size:** 11

### 5.3 The Crew (11 Members)

| ID | Requirement | Priority |
|----|-------------|----------|
| C-1 | **Crew index page**: grid of 11 cards (avatar, alias F1–F11, optional one-line tagline) | Must |
| C-2 | **Individual profile page** per member | Must |
| C-3 | Profile fields: alias (F1–F11), display name (optional later), avatar, short bio, personal photo gallery | Must |
| C-4 | Members are **global** across trips; trip pages can reference which members attended | Should |
| C-5 | Personal photos can be tagged/filtered by trip on the profile page | Could (Phase 2) |

**Initial aliases:** F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11 — real names can replace aliases later without URL changes if we use stable slugs (`f1`, `f2`, …).

### 5.4 Content Management (How to Add Photos & Text)

**Recommended approach: file-based content (no CMS login required)**

| ID | Requirement | Priority |
|----|-------------|----------|
| M-1 | Trip content lives under a predictable path, e.g. `content/trips/cebu-2026/` | Must |
| M-2 | Member content under `content/members/f1/` … `content/members/f11/` | Must |
| M-3 | Trip config in **YAML/Markdown** (title, dates, description, hero image list) | Must |
| M-4 | Photos added by **copying image files** into the trip/member folder | Must |
| M-5 | Optional per-photo caption in a sidecar file or frontmatter | Should |
| M-6 | README for maintainers: “How to add a new trip” and “How to add photos” | Must |

**Example layout:**

```
content/
├── trips/
│   └── cebu-2026/
│       ├── trip.yaml          # metadata + hero slideshow image list
│       ├── gallery/           # all trip photos
│       └── highlights.md      # optional journal entries
└── members/
    ├── f1/
    │   ├── member.yaml        # alias, bio, avatar path
    │   └── photos/
    └── … f2–f11/
```

Adding a new trip = new folder + register in `trips/index.yaml`.

---

## 6. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Lazy-load gallery images; serve WebP/optimized variants where possible |
| **Responsive** | Mobile-first; slideshow and grids work on phone, tablet, desktop |
| **Accessibility** | Alt text for images; keyboard navigation in lightbox; sufficient contrast |
| **SEO** | Basic meta tags per page; Open Graph for link previews |
| **Hosting** | Static site deployable to Vercel, Netlify, GitHub Pages, or similar (no server required) |
| **Privacy** | No public user accounts or comments in v1 (can add later) |

---

## 7. Design Direction (Proposed)

| Element | Direction |
|---------|-----------|
| **Mood** | Warm, travel-journal, candid fun — not corporate |
| **Typography** | Clean sans-serif for UI; optional serif for trip titles |
| **Color** | Light background, ocean/sunset accent (teal, coral, sand) — aligned with Cebu/island theme |
| **Photography** | Photos are the hero; UI stays minimal and out of the way |
| **Animations** | Subtle fade/slide on slideshow; smooth lightbox transitions |

*Final visual design can be refined after content structure is confirmed.*

---

## 8. Technical Stack (Recommendation — for your approval)

| Layer | Proposal | Rationale |
|-------|----------|-----------|
| Framework | **Next.js** (App Router) or **Astro** | Great static export, image optimization, easy routing |
| Styling | **Tailwind CSS** | Fast, consistent responsive layout |
| Content | **YAML + Markdown + folders of images** | Easy for non-devs; git-friendly; no database |
| Images | Built-in image optimization (next/image or Astro assets) | Performance + responsive sizes |
| Deploy | Static export → Vercel / Netlify | Free tier, simple CI from git push |

**Alternative:** Pure static HTML + a small build script — simpler but less polish for galleries and SEO.

*Stack will be finalized after you confirm requirements.*

---

## 9. Out of Scope (Version 1)

- User login / admin panel
- Comments or likes
- Video hosting (can link externally later)
- Multi-language support
- Real-time collaboration
- AI-generated captions

These can be Phase 2+ if needed.

---

## 10. Content You Will Need to Provide

Before or during build:

1. **Trip:** Title, exact dates, 1–2 paragraph English description, location names  
2. **Hero slideshow:** 5–15 best photos (curated)  
3. **Gallery:** All trip photos (organize by day/location if desired)  
4. **Per member (×11):** Avatar image, short English bio (2–4 sentences), personal photos  
5. **Optional:** Highlight captions, inside jokes as captions, trip cover image  

Placeholders are fine for v1; structure can ship before all photos are ready.

---

## 11. Confirmed Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | Homepage slideshow | Featured trip only |
| 2 | Member identity | F1–F11 public; optional real name field |
| 3 | Trip detail (v1) | Gallery + text overview only |
| 4 | Photo organization | Optional day subfolders; group in UI when present |
| 5 | Deployment | Vercel default URL first |
| 6 | Tech stack | Next.js + Tailwind + file-based content |
| 7 | Privacy | Public access |

---

## 12. Delivery Phases (After Confirmation)

| Phase | Deliverable |
|-------|-------------|
| **Phase 1** | Project scaffold, design system, homepage slideshow, Cebu 2026 trip page + gallery, crew index + 11 profile shells |
| **Phase 2** | Lightbox polish, lazy loading, SEO/OG tags, maintainer README |
| **Phase 3** | Your real photos & copy filled in; deploy to production URL |

---

## 13. Summary

**Fun Souls** will be an English-language travel memory site with:

- Rotating hero photos on the home page  
- Multi-trip architecture starting with Cebu 2026  
- A dedicated **The Crew** section for F1–F11  
- File-based content so future trips and photos are easy to add  

**Next step:** Site scaffold is implemented. Install dependencies, add your photos, and deploy to Vercel.

---

*Requirements confirmed. Implementation complete — pending local `npm install` and content fill-in.*
