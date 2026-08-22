import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const brandDir = join(process.cwd(), 'public', 'brand');
const mark = join(brandDir, 'logo-mark.png');
const word = join(brandDir, 'logo-wordmark.png');

if (!existsSync(mark) || !existsSync(word)) {
  console.error('[brand] Missing logo PNGs in public/brand/');
  process.exit(1);
}

const py = `
from PIL import Image
from pathlib import Path

mark = Path(${JSON.stringify(mark)})
img = Image.open(mark).convert('RGBA')
pixels = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r < 28 and g < 28 and b < 28:
            pixels[x, y] = (r, g, b, 0)
img.save(mark)

word = Path(${JSON.stringify(word)})
img = Image.open(word).convert('RGBA')
pixels = img.load()
w, h = img.size

def is_bg(r, g, b):
    if r > 232 and g > 232 and b > 232:
        return True
    spread = max(r, g, b) - min(r, g, b)
    if spread < 12 and min(r, g, b) > 215:
        return True
    return False

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if is_bg(r, g, b):
            pixels[x, y] = (r, g, b, 0)
img.save(word)
print('[brand] Transparent backgrounds applied')
`;

spawnSync('python3', ['-c', py], { stdio: 'inherit' });
