import assert from 'node:assert/strict';
import test from 'node:test';

import { checkContractNumberExists, createContract } from './contracts.js';

/** @type {import('../types/index.js').ContractFormValues} */
const BASE_VALUES = {
  contractNumber: 'HD-001',
  createdDate: '2026-01-01',
  quotationDate: '2025-12-15',
  projectName: 'Dự án A',
  category: 'Máy móc',
  exportCountry: 'Việt Nam',
  portOfLoading: 'Cảng Hải Phòng',
  portOrPlaceOfDestination: 'Cảng Rotterdam',
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
    assert.equal(body.PortOfLoading, 'Cảng Hải Phòng');
    assert.equal(body.PortOrPlaceOfDestination, 'Cảng Rotterdam');
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

test('sends a SourceCustomerId reference when an existing customer is selected, omitting CompanyName', async () => {
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
    assert.equal(body.PartyA.CompanyName, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('still sends RepresentativeName/RepresentativeTitle/Address even when a source customer is selected', async () => {
  // A customer can be Party A on two contracts with a different
  // representative on each — only CompanyName is pinned to the catalog
  // (see `docs/api/Contracts.md`, BE-kt-xnk), so these must not be dropped
  // just because SourceCustomerId is set.
  const originalFetch = globalThis.fetch;
  /** @type {{ init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (_input, init) => {
    captured.init = init;
    return Response.json({ id: 'contract-1' });
  };

  try {
    await createContract(
      {
        ...BASE_VALUES,
        sourceCustomerId: 'customer-1',
        partyAInline: {
          companyName: '',
          representativeName: 'Rep For This Contract',
          representativeTitle: 'CEO',
          address: 'Address for this contract',
        },
      },
      { paymentTerms: [{ paymentRatioPercent: 100, paymentCondition: 'T/T' }] },
    );

    const body = JSON.parse(String(captured.init?.body));
    assert.equal(body.PartyA.SourceCustomerId, 'customer-1');
    assert.equal(body.PartyA.RepresentativeName, 'Rep For This Contract');
    assert.equal(body.PartyA.RepresentativeTitle, 'CEO');
    assert.equal(body.PartyA.Address, 'Address for this contract');
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

test('checkContractNumberExists sends contractNumber and excludeContractId as query params', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ url?: string }} */
  const captured = {};
  globalThis.fetch = async (input) => {
    captured.url = String(input);
    return Response.json({ exists: true });
  };

  try {
    const result = await checkContractNumberExists({
      contractNumber: 'HD-001',
      excludeContractId: 'contract-1',
    });

    assert.equal(result.success, true);
    assert.equal(result.success && result.exists, true);
    assert.match(String(captured.url), /contractNumber=HD-001/);
    assert.match(String(captured.url), /excludeContractId=contract-1/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkContractNumberExists omits excludeContractId when not given', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ url?: string }} */
  const captured = {};
  globalThis.fetch = async (input) => {
    captured.url = String(input);
    return Response.json({ exists: false });
  };

  try {
    const result = await checkContractNumberExists({
      contractNumber: 'HD-002',
    });

    assert.equal(result.success && result.exists, false);
    assert.doesNotMatch(String(captured.url), /excludeContractId/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
