"""Generate PNG icons for the Defang IOC browser extension.
Design: [.] — the canonical defanged-dot notation on a dark background.
"""
import struct, zlib, math, os

BG   = (15, 23, 42)      # #0f172a
CYAN = (34, 211, 238)    # #22d3ee

def make_png(size, get_pixel):
    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    raw = b''.join(
        b'\x00' + b''.join(bytes(get_pixel(x, y)) for x in range(size))
        for y in range(size)
    )
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))

def circle(cx, cy, r, x, y):
    return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2

# ── 16 × 16 ───────────────────────────────────────────────
# "[" at left, dot in center, "]" at right — 1-px lines
def px16(x, y):
    # Left bracket [
    if x in (2, 3) and 2 <= y <= 13: return CYAN        # vertical
    if 2 <= x <= 6 and y in (2, 3): return CYAN          # top
    if 2 <= x <= 6 and y in (12, 13): return CYAN        # bottom
    # Dot ·
    if x in (7, 8) and y in (7, 8): return CYAN
    # Right bracket ]
    if x in (12, 13) and 2 <= y <= 13: return CYAN       # vertical
    if 9 <= x <= 13 and y in (2, 3): return CYAN         # top
    if 9 <= x <= 13 and y in (12, 13): return CYAN       # bottom
    return BG

# ── 48 × 48 ───────────────────────────────────────────────
def px48(x, y):
    t = 3   # line thickness
    s, e = 9, 39  # bracket vertical span
    # Left bracket [
    if 7 <= x <= 7+t-1 and s <= y <= e: return CYAN
    if 7 <= x <= 17 and s <= y <= s+t-1: return CYAN
    if 7 <= x <= 17 and e-t+1 <= y <= e: return CYAN
    # Dot ·
    if circle(24, 24, 5, x, y): return CYAN
    # Right bracket ]
    if 40-t+1 <= x <= 40 and s <= y <= e: return CYAN
    if 30 <= x <= 40 and s <= y <= s+t-1: return CYAN
    if 30 <= x <= 40 and e-t+1 <= y <= e: return CYAN
    return BG

# ── 128 × 128 ─────────────────────────────────────────────
def px128(x, y):
    t = 8   # line thickness
    s, e = 22, 106  # bracket vertical span
    # Left bracket [
    if 10 <= x <= 10+t-1 and s <= y <= e: return CYAN
    if 10 <= x <= 36 and s <= y <= s+t-1: return CYAN
    if 10 <= x <= 36 and e-t+1 <= y <= e: return CYAN
    # Dot ·
    if circle(64, 64, 14, x, y): return CYAN
    # Right bracket ]
    if 118-t+1 <= x <= 118 and s <= y <= e: return CYAN
    if 92 <= x <= 118 and s <= y <= s+t-1: return CYAN
    if 92 <= x <= 118 and e-t+1 <= y <= e: return CYAN
    return BG

os.makedirs('extension', exist_ok=True)
for size, fn, px in [(16, 'icon16.png', px16),
                     (48, 'icon48.png', px48),
                     (128, 'icon128.png', px128)]:
    path = f'extension/{fn}'
    with open(path, 'wb') as f:
        f.write(make_png(size, px))
    print(f'✅  {path}  ({size}×{size})')
