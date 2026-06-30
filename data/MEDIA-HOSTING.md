# Hosting media for "Math is Beautiful"

This covers where to put the images and short video animations for the
gallery, since they're the heaviest media on the site and will keep growing.

## Static images

**Keep them in GitHub**, served either directly via GitHub Pages or — for a
bit more performance headroom — via jsDelivr's CDN, which serves any file
from a public GitHub repo with no extra setup:

```
https://cdn.jsdelivr.net/gh/<username>/<repo>@main/images/math-beautiful/example.jpg
```

Just swap that URL in for the local path in a tile's `data-thumb`/`data-full`
attributes if you want CDN caching. Otherwise the plain relative path
(`images/math-beautiful/example.jpg`) works fine for normal personal-site
traffic, since GitHub Pages itself already serves through Fastly's CDN.

**One practical habit**: export/resize images to roughly 1600–2000px on the
long edge before committing them. There's no benefit to keeping multi-MB,
full-resolution renders in git — web display never needs more than that, and
it keeps the repo light as the gallery grows.

If the repo ever gets large (GitHub is comfortable well past 1GB, but
individual files over 100MB are rejected), consider splitting media into a
separate repo from your code, so your code repos stay small and fast to
clone.

## Short video animations (≤1 min)

**Self-host the MP4s through the same GitHub + jsDelivr pipeline**, rather
than embedding YouTube/Vimeo. Reasoning: third-party video platforms come
with their own player chrome (suggested videos, branding) that breaks the
minimal aesthetic of this site. A native HTML5 `<video>` element, which is
what the lightbox already uses, gives you full control over how it looks.

At ≤1 minute, well-compressed H.264 MP4 (1080p is plenty — no need for 4K),
clips are typically 3–20MB depending on motion complexity. That's small
enough to live comfortably in the repo.

**Quick compression command** (requires `ffmpeg`):

```
ffmpeg -i input.mov -vcodec libx264 -crf 23 -preset slow -movflags +faststart -an output.mp4
```

- `-crf 23` is a good quality/size balance for this kind of content; go to
  `26–28` if a clip is still too large.
- `-movflags +faststart` lets the video start playing before it's fully
  downloaded — important for web playback.
- `-an` strips audio if there isn't any (smaller file); drop it if your
  animations have sound.

**If clips get heavier** (very high frame rate, lots of fine detail, or you
want adaptive bitrate without thinking about encoding), Cloudflare Stream or
Bunny.net Stream are both cheap, ad-free, and give you an embeddable player
you can style to be borderless. Treat this as a fallback rather than a
default — most "Math is Beautiful"-style animations will be fine self-hosted.

## Adding a video piece to the gallery

The lightbox in `math-is-beautiful.html` automatically detects whether
`data-full` points to an image or a video, based on its file extension
(`.mp4` / `.webm` / `.mov` → video player; anything else → image). See the
second example tile in `math-is-beautiful.html` (marked "Example 2: short
looping animation") for the exact markup to copy. You always need a still
poster image for `data-thumb` — the gallery grid never autoplays, only the
lightbox does.
