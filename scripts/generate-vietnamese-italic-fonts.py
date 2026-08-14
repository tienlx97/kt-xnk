"""Generate Vietnamese Optimistic italic subsets from the upright sources.

Meta's react.dev font download list has Vietnamese upright subsets and Western
italic faces, but no Vietnamese italic subsets. Run from anywhere with:

    uv run --with fonttools --with brotli python \
      scripts/generate-vietnamese-italic-fonts.py

The output uses the -11 degree angle and style metadata from each matching
upstream Western italic face. It deliberately keeps the source advance widths,
matching browser synthetic-italic behavior without falling back to a system
font for Vietnamese glyphs.
"""

from math import radians, tan
from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

FONT_DIRECTORY = Path(__file__).resolve().parents[1] / "public/fonts/react-docs"
FONT_PAIRS = [
    (
        "Optimistic_Display_Viet_W_Md.woff2",
        "Optimistic_Display_W_MdIt.woff2",
        "Optimistic_Display_Viet_W_MdIt.woff2",
    ),
    (
        "Optimistic_Display_Viet_W_SBd.woff2",
        "Optimistic_Display_W_SBdIt.woff2",
        "Optimistic_Display_Viet_W_SBdIt.woff2",
    ),
    (
        "Optimistic_Display_Viet_W_Bd.woff2",
        "Optimistic_Display_W_BdIt.woff2",
        "Optimistic_Display_Viet_W_BdIt.woff2",
    ),
    (
        "Optimistic_Text_Viet_W_Rg.woff2",
        "Optimistic_Text_W_It.woff2",
        "Optimistic_Text_Viet_W_It.woff2",
    ),
    (
        "Optimistic_Text_Viet_W_Md.woff2",
        "Optimistic_Text_W_MdIt.woff2",
        "Optimistic_Text_Viet_W_MdIt.woff2",
    ),
    (
        "Optimistic_Text_Viet_W_Bd.woff2",
        "Optimistic_Text_W_BdIt.woff2",
        "Optimistic_Text_Viet_W_BdIt.woff2",
    ),
]


def generate_italic(upright_name, reference_name, output_name):
    font = TTFont(FONT_DIRECTORY / upright_name)
    reference = TTFont(FONT_DIRECTORY / reference_name)
    glyph_set = font.getGlyphSet()
    slant = tan(radians(abs(reference["post"].italicAngle)))
    transform = Transform(1, 0, slant, 1, 0, 0)
    transformed_glyphs = {}

    for glyph_name in font.getGlyphOrder():
        recording = DecomposingRecordingPen(glyph_set)
        glyph_set[glyph_name].draw(recording)
        pen = TTGlyphPen(None)
        recording.replay(TransformPen(pen, transform))
        glyph = pen.glyph()
        glyph.removeHinting()
        transformed_glyphs[glyph_name] = glyph

    font["glyf"].glyphs = transformed_glyphs
    font["post"].italicAngle = reference["post"].italicAngle
    font["head"].macStyle = reference["head"].macStyle
    font["OS/2"].fsSelection = reference["OS/2"].fsSelection
    font["hhea"].caretSlopeRise = reference["hhea"].caretSlopeRise
    font["hhea"].caretSlopeRun = reference["hhea"].caretSlopeRun
    font["hhea"].caretOffset = reference["hhea"].caretOffset
    font.flavor = "woff2"
    font.recalcTimestamp = False
    font.save(FONT_DIRECTORY / output_name)


for font_pair in FONT_PAIRS:
    generate_italic(*font_pair)
    print(f"generated {font_pair[2]}")
