#!/usr/bin/env python3
"""Import Cebu 2026 photos from LINE album exports into the site structure."""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

SOURCE = Path("/Users/ethan/Pictures/Cebu-2026-trip")
ROOT = Path(__file__).resolve().parent.parent
TRIP_PHOTOS = ROOT / "public/photos/trips/cebu-2026"
MEMBERS_PHOTOS = ROOT / "public/photos/members"
TRIP_YAML = ROOT / "content/trips/cebu-2026/trip.yaml"

MAX_EDGE = 2000
HERO_COUNT = 10
MEMBER_COUNT = 11

GALLERY_GROUPS = [
    ("gallery/part-1", "album1", "Part 1"),
    ("gallery/part-2", "album2", "Part 2"),
    ("gallery/food", "hotpot", "Food"),
]


def album_key(path: Path) -> tuple[int, str]:
    match = re.search(r"_(\d+)\.jpg$", path.name, re.IGNORECASE)
    number = int(match.group(1)) if match else 0
    return number, path.name.lower()


def classify(path: Path) -> str:
    name = path.name
    if "Travel photos 2" in name:
        return "album2"
    if "Travel photos" in name:
        return "album1"
    if "hot pot" in name.lower():
        return "hotpot"
    return "other"


def collect_sources() -> dict[str, list[Path]]:
    groups: dict[str, list[Path]] = {
        "album1": [],
        "album2": [],
        "hotpot": [],
        "other": [],
    }
    for path in SOURCE.iterdir():
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        groups[classify(path)].append(path)

    for key in groups:
        groups[key].sort(key=album_key)
    return groups


def optimize_image(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        subprocess.run(
            ["sips", "-Z", str(MAX_EDGE), str(src), "--out", str(dest)],
            check=True,
            capture_output=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        shutil.copy2(src, dest)


def clear_placeholders() -> None:
    for pattern in ("**/*.svg",):
        for path in TRIP_PHOTOS.glob(pattern):
            path.unlink()
        for path in MEMBERS_PHOTOS.glob(pattern):
            if path.name != "avatar.svg" or True:
                path.unlink()


def copy_gallery(groups: dict[str, list[Path]]) -> list[Path]:
    all_travel: list[Path] = []
    gallery_root = TRIP_PHOTOS / "gallery"

    if gallery_root.exists():
        shutil.rmtree(gallery_root)
    gallery_root.mkdir(parents=True, exist_ok=True)

    for rel_dir, group_key, _label in GALLERY_GROUPS:
        target_dir = TRIP_PHOTOS / rel_dir
        target_dir.mkdir(parents=True, exist_ok=True)

        sources = groups[group_key]
        for index, src in enumerate(sources, start=1):
            dest = target_dir / f"{index:03d}.jpg"
            optimize_image(src, dest)
            if group_key in {"album1", "album2"}:
                all_travel.append(dest)

    return all_travel


def pick_hero_sources(all_travel: list[Path]) -> list[Path]:
    """Pick diverse hero candidates by file size, spread across the trip."""
    if not all_travel:
        return []

    ranked = sorted(all_travel, key=lambda p: p.stat().st_size, reverse=True)
    pool = ranked[: max(HERO_COUNT * 3, 30)]

    if len(pool) <= HERO_COUNT:
        chosen = pool
    else:
        step = len(pool) / HERO_COUNT
        chosen = [pool[int(i * step)] for i in range(HERO_COUNT)]

    return chosen[:HERO_COUNT]


def write_heroes(hero_sources: list[Path]) -> list[str]:
    hero_dir = TRIP_PHOTOS / "hero"
    if hero_dir.exists():
        shutil.rmtree(hero_dir)
    hero_dir.mkdir(parents=True, exist_ok=True)

    paths: list[str] = []
    for index, src in enumerate(hero_sources, start=1):
        dest = hero_dir / f"{index:02d}.jpg"
        optimize_image(src, dest)
        paths.append(f"/photos/trips/cebu-2026/hero/{dest.name}")

    return paths


def write_member_avatars(all_travel: list[Path]) -> None:
    if len(all_travel) < MEMBER_COUNT:
        candidates = all_travel
    else:
        step = len(all_travel) / MEMBER_COUNT
        candidates = [all_travel[int(i * step)] for i in range(MEMBER_COUNT)]

    for index in range(1, MEMBER_COUNT + 1):
        slug = f"f{index}"
        member_dir = MEMBERS_PHOTOS / slug
        member_dir.mkdir(parents=True, exist_ok=True)

        for old in member_dir.glob("*.jpg"):
            old.unlink()
        for old in member_dir.glob("*.svg"):
            old.unlink()

        src = candidates[(index - 1) % len(candidates)] if candidates else None
        if src:
            dest = member_dir / "avatar.jpg"
            subprocess.run(
                [
                    "sips",
                    "-Z",
                    "600",
                    str(src),
                    "--out",
                    str(dest),
                ],
                check=False,
                capture_output=True,
            )

        member_yaml = ROOT / f"content/members/{slug}/member.yaml"
        if member_yaml.exists():
            text = member_yaml.read_text()
            text = re.sub(
                r"avatar: .*",
                f"avatar: /photos/members/{slug}/avatar.jpg",
                text,
            )
            member_yaml.write_text(text)


def update_trip_yaml(hero_paths: list[str]) -> None:
    if not hero_paths:
        return

    lines = TRIP_YAML.read_text().splitlines()
    out: list[str] = []
    in_hero = False

    for line in lines:
        if line.startswith("coverImage:"):
            out.append(f"coverImage: {hero_paths[0]}")
            continue
        if line.startswith("heroImages:"):
            out.append("heroImages:")
            for path in hero_paths:
                out.append(f"  - {path}")
            in_hero = True
            continue
        if in_hero:
            if line.startswith("  - "):
                continue
            in_hero = False
        out.append(line)

    TRIP_YAML.write_text("\n".join(out) + "\n")


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(f"Source not found: {SOURCE}")

    groups = collect_sources()
    total = sum(len(v) for v in groups.values())
    print(f"Found {total} photos (album1={len(groups['album1'])}, album2={len(groups['album2'])}, hotpot={len(groups['hotpot'])})")

    clear_placeholders()
    all_travel = copy_gallery(groups)
    hero_sources = pick_hero_sources(all_travel)
    hero_paths = write_heroes(hero_sources)
    write_member_avatars(all_travel)
    update_trip_yaml(hero_paths)

    print(f"Gallery: {len(all_travel)} travel photos + {len(groups['hotpot'])} food photos")
    print(f"Hero slideshow: {len(hero_paths)} photos")
    print(f"Member avatars: {MEMBER_COUNT} (temporary — replace when you assign real portraits)")
    print("Done.")


if __name__ == "__main__":
    main()
