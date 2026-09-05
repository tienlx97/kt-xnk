import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatNumberInput,
  numberValueToInput,
  parseNumberInput,
} from './formatted-number-input.js';

test('formatNumberInput groups integer digits from left to right', () => {
  assert.equal(formatNumberInput('1'), '1');
  assert.equal(formatNumberInput('1234'), '123,4');
  assert.equal(formatNumberInput('12345'), '123,45');
  assert.equal(formatNumberInput('123456.78'), '123,456.78');
  assert.equal(formatNumberInput('123456789.11'), '123,456,789.11');
});

test('formatNumberInput sanitizes pasted values and preserves editing states', () => {
  assert.equal(formatNumberInput('123,456,789.11'), '123,456,789.11');
  assert.equal(formatNumberInput('12 kg 34.567'), '123,4.56');
  assert.equal(formatNumberInput('.'), '0.');
  assert.equal(formatNumberInput('1234.'), '123,4.');
  assert.equal(formatNumberInput(''), '');
});

test('parseNumberInput returns a clean numeric form value', () => {
  assert.equal(parseNumberInput('123,456,789.11'), 123456789.11);
  assert.equal(parseNumberInput('123,4.'), 1234);
  assert.equal(parseNumberInput(''), undefined);
});

test('numberValueToInput formats existing values and handles missing values', () => {
  assert.equal(numberValueToInput(123456.78), '123,456.78');
  assert.equal(numberValueToInput(undefined), '');
});
