# Turns the segmented portrait into particle targets: Int16 (x, y, z, brightness) * COUNT.
import sys, numpy as np
from PIL import Image, ImageFilter

img_path, seg_dir, out_bin, preview_path = sys.argv[1:5]
COUNT = 9000
BUDGET = {3: 0.52, 1: 0.13, 2: 0.09, 4: 0.26}  # face, hair, skin, clothes
rng = np.random.default_rng(7)

img = Image.open(img_path).convert("L")
cat = np.load(seg_dir + "/cat.npy")
person = np.load(seg_dir + "/person.npy")

ys, xs = np.where(cat > 0)
# head and upper chest, trimmed at the sides so the face gets most of the frame
y0 = ys.min() - 12
y1 = 880
x0, x1 = 300, 1050
H = 420
scale = H / (y1 - y0)
W = int((x1 - x0) * scale)
def crop(a, resample):
    return np.asarray(Image.fromarray(a).crop((x0, y0, x1, y1)).resize((W, H), resample))
L = np.asarray(img)
lum = crop(L, Image.LANCZOS).astype(float) / 255
c = crop(cat.astype(np.uint8), Image.NEAREST)
p = crop((person * 255).astype(np.uint8), Image.BILINEAR).astype(float) / 255

def blur(a, r):
    return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float) / 255
local = np.clip(0.5 + (lum - blur(lum, 5)) * 3.0, 0, 1)
edges = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES)).astype(float) / 255

def norm(v):
    lo, hi = np.percentile(v, 3), np.percentile(v, 97)
    return np.clip((v - lo) / max(hi - lo, 1e-6), 0, 1)

bright = np.zeros_like(lum); weight = np.zeros_like(lum); depth = np.zeros_like(lum)
for k in (1, 2, 3, 4):
    m = c == k
    if not m.any():
        continue
    tone = norm(0.55 * lum[m] + 0.45 * local[m])
    if k == 3:   # face: strong tonal stipple so eyes, brows, nostrils and smile read as gaps
        bright[m] = 0.2 + 0.8 * tone
        weight[m] = 0.02 + tone ** 2.8
        depth[m] = 0.3
    elif k == 1: # hair: dark, so texture it from local contrast with a floor
        bright[m] = 0.22 + 0.4 * local[m]
        weight[m] = 0.35 + 0.65 * local[m] ** 1.5
        depth[m] = 0.18
    elif k == 2: # neck and arms
        bright[m] = 0.2 + 0.7 * tone
        weight[m] = 0.05 + tone ** 2
        depth[m] = 0.12
    else:        # white shirt: lean on folds and seams
        fold = np.clip(np.abs(local[m] - 0.5) * 3.5, 0, 1)
        bright[m] = 0.35 + 0.55 * tone
        weight[m] = 0.15 + fold + 0.8 * edges[m]
        depth[m] = 0.0
weight *= p

px_all, py_all = [], []
for k, share in BUDGET.items():
    w = np.where(c == k, weight, 0).ravel()
    n = int(round(COUNT * share)) if k != 4 else COUNT - sum(len(a) for a in px_all)
    idx = rng.choice(w.size, size=n, p=w / w.sum())
    yy, xx = np.divmod(idx, W)
    px_all.append(xx); py_all.append(yy)
px = np.concatenate(px_all); py = np.concatenate(py_all)
perm = rng.permutation(COUNT); px, py = px[perm], py[perm]

s = 4.3 / H
X = (px + rng.random(COUNT) - 0.5 - W / 2) * s
Y = -(py + rng.random(COUNT) - 0.5 - H / 2) * s
cx = (px - W / 2) / (W / 2)
Z = depth[py, px] + 0.25 * (1 - np.clip(cx ** 2, 0, 1)) + (rng.random(COUNT) - 0.5) * 0.05
B = bright[py, px]
q = np.stack([X * 8000, Y * 8000, Z * 8000, B * 32767], axis=1).round().astype(np.int16)
q.tofile(out_bin)
print("grid", W, H, "bytes", q.nbytes, "x", X.min().round(2), X.max().round(2), "y", Y.min().round(2), Y.max().round(2))

pv = np.zeros((H * 2, W * 2))
for x, y, b in zip(px * 2, py * 2, B):
    pv[y, x] += b
pv = blur(np.clip(pv, 0, 1), 0.9) * 2.4
Image.fromarray((np.clip(pv, 0, 1) * 255).astype(np.uint8)).save(preview_path)
