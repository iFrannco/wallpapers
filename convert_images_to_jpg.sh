#!/usr/bin/env bash
set -euo pipefail

if ! command -v magick >/dev/null 2>&1; then
  echo "Error: no encuentro 'magick' (ImageMagick)."
  exit 1
fi

# Recorre SOLO archivos .png en el directorio actual (no subcarpetas)
find . -maxdepth 1 -type f -iname '*.png' -print0 |
while IFS= read -r -d '' in; do
  out="${in%.*}.jpg"

  if [[ -e "$out" ]]; then
    echo "SKIP (ya existe): $out"
    continue
  fi

  echo "CONVERT: $in -> $out"
  magick "$in" -alpha off -sampling-factor 4:4:4 -quality 100 "$out"
done

echo "Listo."
