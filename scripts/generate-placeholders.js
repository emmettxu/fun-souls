#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "demo-assets", "photos");

const palettes = [
  ["#0d9488", "#14b8a6", "#ccfbf1"],
  ["#0369a1", "#0284c7", "#e0f2fe"],
  ["#ea580c", "#f97316", "#ffedd5"],
  ["#7c3aed", "#8b5cf6", "#ede9fe"],
  ["#be185d", "#db2777", "#fce7f3"],
];

function heroSvg(label, colors) {
  const [a, b, c] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <circle cx="1280" cy="180" r="120" fill="white" fill-opacity="0.12"/>
  <circle cx="200" cy="720" r="180" fill="white" fill-opacity="0.08"/>
  <text x="80" y="820" fill="white" fill-opacity="0.9" font-family="Georgia, serif" font-size="48">${label}</text>
  <text x="80" y="860" fill="white" fill-opacity="0.55" font-family="system-ui, sans-serif" font-size="22">Replace with your photo</text>
</svg>`;
}

function thumbSvg(label, colors, size = 800) {
  const [a, b, c] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${c}" font-family="system-ui, sans-serif" font-size="${size * 0.08}" font-weight="600">${label}</text>
</svg>`;
}

function avatarSvg(label, colors) {
  const [a, b] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="200" fill="url(#g)"/>
  <text x="200" y="215" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="72" font-weight="700">${label}</text>
</svg>`;
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

const photosRoot = path.join(OUT);

for (let i = 1; i <= 6; i++) {
  const colors = palettes[(i - 1) % palettes.length];
  write(
    path.join(photosRoot, "trips/cebu-2026/hero", `${String(i).padStart(2, "0")}.svg`),
    heroSvg(`Cebu 2026 — Hero ${i}`, colors),
  );
}

const groups = [
  { folder: "part-1", label: "Part 1", count: 4 },
  { folder: "part-2", label: "Part 2", count: 4 },
  { folder: "food", label: "Food", count: 2 },
];

groups.forEach((group, gi) => {
  for (let i = 1; i <= group.count; i++) {
    const colors = palettes[(gi + i) % palettes.length];
    write(
      path.join(photosRoot, "trips/cebu-2026/gallery", group.folder, `${String(i).padStart(2, "0")}.svg`),
      thumbSvg(`${group.label} · ${i}`, colors),
    );
  }
});

for (let n = 1; n <= 11; n++) {
  const slug = `f${n}`;
  const colors = palettes[(n - 1) % palettes.length];
  const memberDir = path.join(photosRoot, "members", slug);
  write(path.join(memberDir, "avatar.svg"), avatarSvg(`F${n}`, colors));
  for (let p = 1; p <= 2; p++) {
    write(
      path.join(memberDir, `${String(p).padStart(2, "0")}.svg`),
      thumbSvg(`F${n} · ${p}`, colors, 600),
    );
  }
}

console.log(`Demo placeholders written to ${OUT}`);
