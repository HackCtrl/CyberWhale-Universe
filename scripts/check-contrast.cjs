const fs = require('fs');
const path = require('path');

function hexToRgb(hex) {
  if (hex.startsWith('rgba')) {
    const parts = hex.match(/rgba?\(([^)]+)\)/)[1].split(',').map(p => p.trim());
    return parts.slice(0,3).map(Number);
  }
  if (hex.startsWith('rgb')) {
    const parts = hex.match(/rgb\(([^)]+)\)/)[1].split(',').map(p => p.trim());
    return parts.map(Number);
  }
  let h = hex.replace('#','');
  if (h.length === 3) h = h.split('').map(c=>c+c).join('');
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function srgbToLin(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
  const [r,g,b] = rgb.map(srgbToLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(hex1, hex2) {
  const rgb1 = hex1.startsWith('rgba') || hex1.startsWith('rgb') ? hexToRgb(hex1) : hexToRgb(hex1);
  const rgb2 = hex2.startsWith('rgba') || hex2.startsWith('rgb') ? hexToRgb(hex2) : hexToRgb(hex2);
  const L1 = luminance(rgb1);
  const L2 = luminance(rgb2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const tokensPath = path.join(__dirname, '..', 'src', 'styles', 'design-tokens.json');
if (!fs.existsSync(tokensPath)) {
  console.error('design-tokens.json not found at', tokensPath);
  process.exit(2);
}
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const bg = tokens.color.background;
const fg = tokens.color.foreground;
const primary = tokens.color.primary;
const secondary = tokens.color.secondary;
const accent = tokens.color.accent;

const checks = [
  { name: 'Foreground / Background', a: fg, b: bg, level: 'AAA (normal >=7, large >=4.5)' },
  { name: 'Primary / Background', a: primary, b: bg, level: 'AAA (normal >=7, large >=4.5)' },
  { name: 'Secondary / Background', a: secondary, b: bg, level: 'AAA (normal >=7, large >=4.5)' },
  { name: 'Accent / Background', a: accent, b: bg, level: 'AAA (normal >=7, large >=4.5)' }
];

console.log('Contrast checks (WCAG AAA targets):');
let failed = [];
for (const c of checks) {
  const ratio = contrast(c.a, c.b);
  const okNormal = ratio >= 7;
  const okLarge = ratio >= 4.5;
  const status = okNormal ? 'PASS (normal text >=7:1)' : okLarge ? 'PASS (large text only >=4.5:1)' : 'FAIL';
  console.log(`- ${c.name}: ${c.a} on ${c.b} — ratio ${ratio.toFixed(2)} — ${status}`);
  if (!okLarge) failed.push({ ...c, ratio });
}

if (failed.length) {
  console.log('\nProblems found:');
  failed.forEach(f => console.log(`- ${f.name}: ratio ${f.ratio.toFixed(2)} (needs >=4.5 for large text or >=7 for normal)`));
  process.exitCode = 1;
} else {
  console.log('\nAll checked pairs meet at least large-text AAA (4.5:1).');
}
