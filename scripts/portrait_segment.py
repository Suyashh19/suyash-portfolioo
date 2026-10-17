import sys, numpy as np
from PIL import Image, ImageFilter
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision

img_path, model_path, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
img = Image.open(img_path).convert("RGB")
opts = vision.ImageSegmenterOptions(base_options=mpt.BaseOptions(model_asset_path=model_path), output_category_mask=True, output_confidence_masks=True)
with vision.ImageSegmenter.create_from_options(opts) as seg:
    res = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.asarray(img)))
cat = res.category_mask.numpy_view().squeeze()
bg_conf = res.confidence_masks[0].numpy_view().squeeze()
print("shape", cat.shape, "classes", np.unique(cat, return_counts=True))
person = 1.0 - bg_conf
np.save(out_dir + "/cat.npy", cat); np.save(out_dir + "/person.npy", person)
# preview: dim background
arr = np.asarray(img).astype(float)
prev = arr * (0.15 + 0.85 * person[..., None])
Image.fromarray(prev.astype(np.uint8)).save(out_dir + "/preview.jpg")
palette = np.array([[0,0,0],[160,80,30],[255,200,150],[255,120,60],[80,140,255],[0,255,0]], dtype=np.uint8)
Image.fromarray(palette[cat]).save(out_dir + "/categories.png")
