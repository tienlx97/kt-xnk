import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const cssPath = path.join(projectRoot, 'src/app/globals.css');
const fontDirectory = path.join(projectRoot, 'public/fonts/react-docs');

const vietnameseFaces = [
  [
    'Optimistic Display Vietnamese',
    500,
    'normal',
    'Optimistic_Display_Viet_W_Md.woff2',
  ],
  [
    'Optimistic Display Vietnamese',
    500,
    'italic',
    'Optimistic_Display_Viet_W_MdIt.woff2',
  ],
  [
    'Optimistic Display Vietnamese',
    600,
    'normal',
    'Optimistic_Display_Viet_W_SBd.woff2',
  ],
  [
    'Optimistic Display Vietnamese',
    600,
    'italic',
    'Optimistic_Display_Viet_W_SBdIt.woff2',
  ],
  [
    'Optimistic Display Vietnamese',
    700,
    'normal',
    'Optimistic_Display_Viet_W_Bd.woff2',
  ],
  [
    'Optimistic Display Vietnamese',
    700,
    'italic',
    'Optimistic_Display_Viet_W_BdIt.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    400,
    'normal',
    'Optimistic_Text_Viet_W_Rg.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    400,
    'italic',
    'Optimistic_Text_Viet_W_It.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    500,
    'normal',
    'Optimistic_Text_Viet_W_Md.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    500,
    'italic',
    'Optimistic_Text_Viet_W_MdIt.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    700,
    'normal',
    'Optimistic_Text_Viet_W_Bd.woff2',
  ],
  [
    'Optimistic Text Vietnamese',
    700,
    'italic',
    'Optimistic_Text_Viet_W_BdIt.woff2',
  ],
];

test('declares every Vietnamese Optimistic weight and style as a complete face', async () => {
  const css = await readFile(cssPath, 'utf8');
  const faceBlocks = [...css.matchAll(/@font-face\s*\{(?<body>[^}]*)\}/gu)].map(
    (match) => match.groups.body,
  );

  for (const [family, weight, style, fileName] of vietnameseFaces) {
    const face = faceBlocks.find(
      (block) =>
        block.includes(`font-family: '${family}'`) &&
        block.includes(`font-weight: ${weight}`) &&
        block.includes(`font-style: ${style}`),
    );

    assert.ok(face, `missing ${family} ${weight} ${style}`);
    assert.match(face, new RegExp(fileName.replaceAll('.', '\\.')));
    assert.doesNotMatch(
      face,
      /unicode-range/u,
      `${family} must remain a complete face so NFD grapheme clusters stay in one font`,
    );

    const font = await readFile(path.join(fontDirectory, fileName));
    assert.ok(font.byteLength > 10_000, `${fileName} is unexpectedly empty`);
  }
});
