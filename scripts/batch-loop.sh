#!/bin/bash
# batch-loop.sh — process the entire plants-to-generate.txt list in batches
# of 5, committing and pushing after each batch. Exits when no plants remain
# or when any step fails.

set -e
cd "$(dirname "$0")/.."

BATCH=0
while true; do
  BATCH=$((BATCH+1))

  # Count remaining (undone) plants via a dry-run
  REMAINING=$(node scripts/generate-images.mjs --dry-run --yes 2>/dev/null | grep -c "would write" || true)
  # Each plant emits 2 "would write" lines (front + back)
  PLANTS_LEFT=$((REMAINING / 2))

  if [ "$PLANTS_LEFT" -eq 0 ]; then
    echo "🎉 All plants processed after batch $((BATCH-1))"
    exit 0
  fi

  TARGET=5
  [ "$PLANTS_LEFT" -lt "$TARGET" ] && TARGET=$PLANTS_LEFT

  echo "=== Batch $BATCH: $PLANTS_LEFT plants remaining, generating $TARGET ==="

  # 1) Generate images (capture output so we can inspect success count)
  BATCH_LOG=$(mktemp)
  node scripts/generate-images.mjs --first "$TARGET" --high --yes 2>&1 | tee "$BATCH_LOG" | tail -12
  # If the batch generated ZERO successes, the API is unreachable / billing
  # is broken. Fail fast instead of looping forever.
  if grep -qE "^Done in .* 0 generated," "$BATCH_LOG"; then
    echo "⚠  Batch $BATCH generated 0 images — aborting loop."
    rm -f "$BATCH_LOG"
    exit 1
  fi
  rm -f "$BATCH_LOG"

  # 2) Link into PLANTS
  node scripts/link-plates.mjs 2>&1 | tail -6

  # 3) Commit + push
  git add index.html sw.js plates/*.webp
  git commit -m "Batch $BATCH: add $TARGET pipeline-generated plants

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
  git push origin main

  # 4) Sync vintage-theme
  git checkout vintage-theme
  git merge main --ff-only
  git push origin vintage-theme
  git checkout main

  echo "=== Batch $BATCH complete ==="
done
