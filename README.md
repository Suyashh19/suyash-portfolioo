# Suyash Patil — Portfolio

Personal portfolio built with **Next.js 16 (App Router) + TypeScript**, **Tailwind CSS v4**, **Motion for React** and **React Three Fiber**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Editing content (no UI code needed)

Everything on the site renders from `src/data/`:

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, rotating titles, tagline, About text, location, availability pill, photos, resume link, social links |
| `projects.ts` | Projects: order, text, stack, metrics, links. `featured: false` moves one to "More builds". Add `image: "/images/x.png"` to replace the generated artwork with a screenshot |
| `achievements.ts` | Experience, hackathons and certifications (`kind` sets the icon and label) |
| `skills.ts` | Skill groups (`level: "core"` highlights a skill), coding profiles and ratings, education |
| `site.ts` | Section order and visibility, section headings, hero stats and SEO |


**Resume:** put `resume.pdf` in `public/` and set `resumeUrl: "/resume.pdf"` in `profile.ts`. Download buttons appear automatically.

**Photos:** live in `public/images/`. Change `photos` in `profile.ts`. `position` controls the crop focus.

## Hero particle portrait

The first hero particle shape is generated from `public/images/suyash-portrait.jpg` into `public/portrait-points.bin`.
To regenerate it from a different photo:

```bash
python -m venv .segenv && .segenv/Scripts/pip install mediapipe pillow numpy   # macOS/Linux: .segenv/bin/pip
# Google's official MediaPipe person-segmentation model (~16 MB)
curl -L -o selfie_multiclass.tflite https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
mkdir seg
.segenv/Scripts/python scripts/portrait_segment.py public/images/your-photo.jpg selfie_multiclass.tflite seg
.segenv/Scripts/python scripts/portrait_points.py public/images/your-photo.jpg seg public/portrait-points.bin seg/preview.png
```

`seg/preview.png` shows the result. The crop (`y1`, `x0`, `x1`) and the per-region particle budget at the top of
`portrait_points.py` are tuned for the current photo, so adjust them for a new one.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at vercel.com/new. The defaults work.
3. Update `site.url` in `src/data/site.ts` to your final domain.
