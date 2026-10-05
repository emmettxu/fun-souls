#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "demo-assets" / "photos"

PALETTES = [
    ("#0d9488", "#14b8a6", "#ccfbf1"),
    ("#0369a1", "#0284c7", "#e0f2fe"),
    ("#ea580c", "#f97316", "#ffedd5"),
    ("#7c3aed", "#8b5cf6", "#ede9fe"),
    ("#be185d", "#db2777", "#fce7f3"),
]


def hero_svg(label: str, colors: tuple[str, str, str]) -> str:
    a, b, c = colors
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{a}"/>
      <stop offset="55%" stop-color="{b}"/>
      <stop offset="100%" stop-color="{c}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <circle cx="1280" cy="180" r="120" fill="white" fill-opacity="0.12"/>
  <circle cx="200" cy="720" r="180" fill="white" fill-opacity="0.08"/>
  <text x="80" y="820" fill="white" fill-opacity="0.9" font-family="Georgia, serif" font-size="48">{label}</text>
  <text x="80" y="860" fill="white" fill-opacity="0.55" font-family="system-ui, sans-serif" font-size="22">Replace with your photo</text>
</svg>"""


def thumb_svg(label: str, colors: tuple[str, str, str], size: int = 800) -> str:
    a, b, c = colors
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{a}"/>
      <stop offset="100%" stop-color="{b}"/>
    </linearGradient>
  </defs>
  <rect width="{size}" height="{size}" fill="url(#g)"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="{c}" font-family="system-ui, sans-serif" font-size="{int(size * 0.08)}" font-weight="600">{label}</text>
</svg>"""


def avatar_svg(label: str, colors: tuple[str, str, str]) -> str:
    a, b, _ = colors
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{a}"/>
      <stop offset="100%" stop-color="{b}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="200" fill="url(#g)"/>
  <text x="200" y="215" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="72" font-weight="700">{label}</text>
</svg>"""


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


for i in range(1, 7):
    colors = PALETTES[(i - 1) % len(PALETTES)]
    write(OUT / f"trips/cebu-2026/hero/{i:02d}.svg", hero_svg(f"Cebu 2026 — Hero {i}", colors))

groups = [
    ("part-1", "Part 1", 4),
    ("part-2", "Part 2", 4),
    ("food", "Food", 2),
]

for gi, (folder, label, count) in enumerate(groups):
    for i in range(1, count + 1):
        colors = PALETTES[(gi + i) % len(PALETTES)]
        write(
            OUT / f"trips/cebu-2026/gallery/{folder}/{i:02d}.svg",
            thumb_svg(f"{label} · {i}", colors),
        )

for n in range(1, 12):
    slug = f"f{n}"
    colors = PALETTES[(n - 1) % len(PALETTES)]
    write(OUT / f"members/{slug}/avatar.svg", avatar_svg(f"F{n}", colors))
    for p in range(1, 3):
        write(OUT / f"members/{slug}/{p:02d}.svg", thumb_svg(f"F{n} · {p}", colors, 600))

print(f"Demo placeholders written to {OUT}")
