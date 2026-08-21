import assert from 'node:assert/strict';
import test from 'node:test';

import { registerUser } from './register.js';

test('creates the user and additional permissions in one request', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ input?: string, init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (input, init) => {
    captured.input = String(input);
    captured.init = init;
    return Response.json({ id: 'user-1', employeeCode: 'DNG26ABC123' });
  };

  try {
    const result = await registerUser({
      nationalId: '012345678901',
      firstName: 'An',
      lastName: 'Nguyen',
      password: 'Secret1!',
      yearOfBirth: 1997,
      gender: 'Male',
      nationalIdIssueDate: '2021-05-10',
      nationalIdIssuePlace: 'Cục Cảnh sát',
      passportNumber: '',
      phone: '0912345678',
      oldProvince: 'Thành phố Hồ Chí Minh',
      oldDistrict: 'Quận 1',
      oldWard: 'Phường Bến Nghé',
      oldAddressDetail: '123 Lê Lợi',
      newProvince: 'Thành phố Hồ Chí Minh',
      newWard: 'Phường Sài Gòn',
      newAddressDetail: '123 Lê Lợi',
      positionId: 'position-1',
      companyId: 'company-1',
      branchId: 'branch-1',
      departmentId: 'department-1',
      extraPermissions: ['logistics:secret'],
    });

    assert.deepEqual(result, {
      success: true,
      id: 'user-1',
      employeeCode: 'DNG26ABC123',
    });
    assert.equal(captured.input, '/api/backend/api/v1/authentication/register');
    assert.equal(captured.init?.method, 'POST');
    const body = JSON.parse(String(captured.init?.body));
    assert.deepEqual(body.ExtraPermissions, ['logistics:secret']);
    assert.equal(body.DepartmentId, 'department-1');
    assert.equal(body.BranchId, 'branch-1');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
