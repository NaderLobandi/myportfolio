#!/bin/sh
# Resize + re-encode public/phd images for web, using macOS's built-in sips.
# Full-res originals are kept in _originals/ (gitignored), and every run derives
# from those — so re-running never compounds JPEG losses.
#
# An already-well-compressed original is left alone: if re-encoding would make
# the file bigger, we keep the original bytes.
set -e
cd "$(dirname "$0")/../public/phd"
mkdir -p _originals

# Back up anything not yet in _originals. Skip a file whose basename is already
# backed up under another extension — that one IS our own .jpg output, and
# letting it into _originals would make the next run re-encode a re-encode.
for f in *.png *.jpg *.jpeg *.JPG *.JPEG *.PNG; do
  [ -e "$f" ] || continue
  [ -e "_originals/$f" ] && continue
  ls "_originals/${f%.*}".* >/dev/null 2>&1 && continue
  cp "$f" "_originals/$f"
done

cd _originals
for f in *; do
  [ -f "$f" ] || continue
  out="../${f%.*}.jpg"
  tmp="../.opt-tmp.jpg"
  sips -s format jpeg -s formatOptions 72 -Z 2400 "$f" --out "$tmp" >/dev/null

  # keep whichever is smaller: the re-encode, or the untouched original
  if [ "$(stat -f%z "$tmp")" -lt "$(stat -f%z "$f")" ]; then
    mv "$tmp" "$out"
  else
    rm "$tmp"
    cp "$f" "../$f"
    out="../$f"
  fi

  # drop the stale source if it had a different name (skip case-only renames,
  # which are the same file on a case-insensitive volume)
  old="../$f"
  [ "$old" = "$out" ] || [ ! -e "$old" ] || [ "$old" -ef "$out" ] || rm "$old"
done

cd ..
du -sh . _originals
