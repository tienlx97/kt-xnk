import assert from 'node:assert/strict';
import test from 'node:test';

import { createContract } from './contracts.js';

/** @type {import('../types/index.js').ContractFormValues} */
const BASE_VALUES = {
  contractNumber: 'HD-001',
  createdDate: '2026-01-01',
  quotationDate: '2025-12-15',
  projectName: 'Dự án A',
  category: 'Máy móc',
  exportCountry: 'Việt Nam',
  contractValue: 100000,
  currency: 'USD',
  incoterm: 'CIF',
  incotermYear: 2020,
  companyId: 'company-1',
  branchId: 'branch-1',
  sourceCustomerId: '',
  partyAInline: {
    companyName: 'ACME Corp',
    representativeName: '',
    representativeTitle: '',
    address: '',
  },
  bankIds: ['bank-1'],
};

test('sends an inline Party A when no source customer is selected', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (_input, init) => {
    captured.init = init;
    return Response.json({ id: 'contract-1' });
  };

  try {
    await createContract(BASE_VALUES, {
      paymentTerms: [{ paymentRatioPercent: 100, paymentCondition: 'T/T' }],
    });

    const body = JSON.parse(String(captured.init?.body));
    assert.equal(body.PartyA.SourceCustomerId, null);
    assert.equal(body.PartyA.CompanyName, 'ACME Corp');
    assert.equal(body.BranchId, 'branch-1');
    assert.equal(body.Currency, 'USD');
    assert.deepEqual(body.PaymentTerms, [
      { PaymentRatioPercent: 100, PaymentCondition: 'T/T' },
    ]);
    assert.deepEqual(body.BankIds, ['bank-1']);
    assert.equal(body.NotifyParty, null);
    assert.equal(body.Consignee, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('sends a SourceCustomerId reference when an existing customer is selected, ignoring inline fields', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (_input, init) => {
    captured.init = init;
    return Response.json({ id: 'contract-1' });
  };

  try {
    await createContract(
      { ...BASE_VALUES, sourceCustomerId: 'customer-1' },
      { paymentTerms: [{ paymentRatioPercent: 100, paymentCondition: 'T/T' }] },
    );

    const body = JSON.parse(String(captured.init?.body));
    assert.equal(body.PartyA.SourceCustomerId, 'customer-1');
    assert.equal(body.PartyA.CompanyName, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('sends BranchId as null when the branch is left blank', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (_input, init) => {
    captured.init = init;
    return Response.json({ id: 'contract-1' });
  };

  try {
    await createContract(
      { ...BASE_VALUES, branchId: '' },
      { paymentTerms: [{ paymentRatioPercent: 100, paymentCondition: 'T/T' }] },
    );

    const body = JSON.parse(String(captured.init?.body));
    assert.equal(body.BranchId, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
