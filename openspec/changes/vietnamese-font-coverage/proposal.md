# Proposal: Complete Vietnamese font coverage

**Status:** in-progress
**Created:** 2026-08-14

## Why

The Optimistic font files contain Vietnamese glyphs, but the current
`unicode-range` excludes `Ơơ`, `Ưư`, and decomposed NFD grapheme clusters.
Chromium therefore mixes Optimistic with a system font. Upstream provides no
Vietnamese italic subsets, so italic Vietnamese falls back even more often.

## What changes

- Promote the Vietnamese subsets to dedicated complete font families used by
  the Vietnamese-first theme.
- Add locally slanted Vietnamese italic subsets at Optimistic's native 11°
  angle for every configured body and display weight, plus a reproducible
  generation script.
- Keep the upstream Western families as fallback coverage for characters that
  are outside the Vietnamese subset.
- Add a regression test for every expected family/weight/style asset.

## Out of scope

- Replacing Optimistic with another font family.
- Changing the typography scale, weights, or layout.
- Editing the unrelated Docs landing-page content or TOC expectation.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-14 | Use dedicated Vietnamese-first families instead of narrow `unicode-range` overlays | One face must cover the base letter and combining marks for reliable NFD shaping. |
| 2026-08-14 | Generate Vietnamese italic subsets at the upstream font's -11° angle | The official react.dev font list contains Vietnamese upright subsets and Western italic faces, but no Vietnamese italic assets. |
