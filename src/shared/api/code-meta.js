import rangeParser from 'parse-numeric-range';

/** @typedef {{ from: number, to: number, step: number }} InlineRange */

/** @param {string} meta */
export function getHighlightLines(meta) {
  const parsed = /\{([\d,-]+)\}/u.exec(meta);
  return parsed ? rangeParser(parsed[1]) : [];
}

/**
 * Parses react.dev's `[[step,line,"substring",fromIndex?]]` fence metadata.
 * Returned offsets address the complete source string, not each line.
 * @param {string} meta
 * @param {string} code
 * @returns {InlineRange[]}
 */
export function getInlineHighlights(meta, code) {
  const parsed = /(\[\[.*\]\])/u.exec(meta);
  if (!parsed) return [];

  const lines = code.split('\n');
  const encoded = /** @type {[number, number, string, number?][]} */ (
    JSON.parse(parsed[1])
  );
  const lineOffsets = [0];
  for (let index = 0; index < lines.length - 1; index += 1) {
    lineOffsets.push(lineOffsets[index] + lines[index].length + 1);
  }

  return encoded.map(([step, lineNumber, substring, fromIndex]) => {
    const line = lines[lineNumber - 1];
    if (line === undefined) {
      throw new Error(`Could not find line ${lineNumber}.`);
    }

    const firstMatch = line.indexOf(substring);
    const lastMatch = line.lastIndexOf(substring);
    if (firstMatch !== lastMatch && fromIndex === undefined) {
      throw new Error(
        `Found multiple occurrences of '${substring}' on line ${lineNumber}; provide fromIndex.`,
      );
    }

    const column = line.indexOf(substring, fromIndex ?? 0);
    if (column === -1) throw new Error(`Could not find: '${substring}'`);

    return {
      from: lineOffsets[lineNumber - 1] + column,
      to: lineOffsets[lineNumber - 1] + column + substring.length,
      step,
    };
  });
}
