import assert from 'node:assert/strict';
import test from 'node:test';

import { formatMoney } from './currencies.js';

test('formatMoney uses comma thousands and exactly two decimal digits', () => {
  assert.equal(formatMoney(1234567.8), '1,234,567.80');
  assert.equal(formatMoney(1234.567), '1,234.57');
  assert.equal(formatMoney(0), '0.00');
});

test('formatMoney appends a currency only when provided', () => {
  assert.equal(formatMoney(50000, 'USD'), '50,000.00 USD');
  assert.equal(formatMoney(50000), '50,000.00');
});

test('formatMoney returns an empty string for missing or non-finite values', () => {
  assert.equal(formatMoney(undefined), '');
  assert.equal(formatMoney(null), '');
  assert.equal(formatMoney(Number.NaN), '');
  assert.equal(formatMoney(Number.POSITIVE_INFINITY), '');
});
