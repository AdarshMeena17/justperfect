#!/usr/bin/env bash
# Creates lightweight web derivatives. Originals are never modified.
#
# Put originals in:   media-src/<category>/*.mp4|mov     (category = events, influencer, wedding,
#                                                        basic-edits, business, gym-sports)
# Outputs:            public/media/<category>/<name>.mp4  (H.264, max 720p, no audio, faststart)
#                     public/media/<category>/<name>.webm (VP9, optional)
#                     public/posters/<category>-<name>.jpg
# Then reference the outputs in src/data/media.js.
set -euo pipefail
command -v ffmpeg >/dev/null || { echo "ffmpeg not found. Install it first."; exit 1; }

shopt -s nullglob
for dir in media-src/*/; do
  cat="$(basename "$dir")"
  mkdir -p "public/media/$cat" public/posters
  for f in "$dir"*.{mp4,mov,MP4,MOV}; do
    name="$(basename "${f%.*}")"
    echo "→ $cat/$name"
  ffmpeg -y -loglevel error -i "$f" \
  -map 0:v:0 -map '0:a?' \
  -vf "scale=w='if(gte(iw,ih),min(1280,iw),-2)':h='if(gte(iw,ih),-2,min(1280,ih))'" \
  -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart \
  "public/media/$cat/$name.mp4"
    ffmpeg -y -loglevel error -ss 1 -i "$f" -frames:v 1 -vf "scale='min(720,iw)':-2" -q:v 4 \
      "public/posters/$cat-$name.jpg"
    # Optional WebM (uncomment if wanted):
    # ffmpeg -y -loglevel error -i "$f" -an -vf "scale='min(720,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 "public/media/$cat/$name.webm"
  done
done
echo "Done. Now update src/data/media.js."
