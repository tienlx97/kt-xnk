import assert from 'node:assert/strict';
import test from 'node:test';

import {
  decodeJwtPayload,
  normalizePermissions,
  normalizeRoles,
  parsePermissionsCookie,
  parseRolesCookie,
} from './jwt.js';

/** @param {Record<string, unknown>} payload */
function makeToken(payload) {
  const base64url = (value) =>
    Buffer.from(JSON.stringify(value))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.signature-not-verified`;
}

test('decodes a well-formed JWT payload', () => {
  const token = makeToken({ id: 'user-1', roles: ['Admin', 'Logistics'] });
  assert.deepEqual(decodeJwtPayload(token), {
    id: 'user-1',
    roles: ['Admin', 'Logistics'],
  });
});

test('returns null for a malformed token', () => {
  assert.equal(decodeJwtPayload('not-a-jwt'), null);
  assert.equal(decodeJwtPayload('only.two'), null);
  assert.equal(decodeJwtPayload(''), null);
});

test('normalizes a single-role payload (bare string) to an array', () => {
  assert.deepEqual(normalizeRoles({ roles: 'Admin' }), ['Admin']);
});

test('normalizes a multi-role payload (array) unchanged', () => {
  assert.deepEqual(normalizeRoles({ roles: ['Admin', 'Logistics'] }), [
    'Admin',
    'Logistics',
  ]);
});

test('normalizes a missing roles claim to an empty array', () => {
  assert.deepEqual(normalizeRoles({}), []);
  assert.deepEqual(normalizeRoles(null), []);
});

test('parses a JSON-stringified roles cookie', () => {
  assert.deepEqual(
    parseRolesCookie(JSON.stringify(['Admin', 'Logistics'])),
    ['Admin', 'Logistics'],
  );
});

test('treats a missing or malformed roles cookie as no roles', () => {
  assert.deepEqual(parseRolesCookie(undefined), []);
  assert.deepEqual(parseRolesCookie(''), []);
  assert.deepEqual(parseRolesCookie('not-json'), []);
  assert.deepEqual(parseRolesCookie('{"not":"an array"}'), []);
});

test('normalizes a single-permission payload (bare string) to an array', () => {
  assert.deepEqual(normalizePermissions({ permissions: 'logistics:view' }), [
    'logistics:view',
  ]);
});

test('normalizes a multi-permission payload (array) unchanged', () => {
  assert.deepEqual(
    normalizePermissions({
      permissions: ['logistics:view', 'departments:manage'],
    }),
    ['logistics:view', 'departments:manage'],
  );
});

test('normalizes a missing permissions claim to an empty array', () => {
  assert.deepEqual(normalizePermissions({}), []);
  assert.deepEqual(normalizePermissions(null), []);
});

test('parses a JSON-stringified permissions cookie', () => {
  assert.deepEqual(
    parsePermissionsCookie(
      JSON.stringify(['logistics:view', 'departments:manage']),
    ),
    ['logistics:view', 'departments:manage'],
  );
});

test('treats a missing or malformed permissions cookie as no permissions', () => {
  assert.deepEqual(parsePermissionsCookie(undefined), []);
  assert.deepEqual(parsePermissionsCookie(''), []);
  assert.deepEqual(parsePermissionsCookie('not-json'), []);
});
