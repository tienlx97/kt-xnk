# Logistics Contracts — Commission Naming Delta

## Requirement: Commission terminology and routes

The frontend SHALL expose the third-party commission feature as Commission
through its navigation, standalone page, contract details, forms, types, and
client-side API.

### Scenario: View the Commission list

- **WHEN** an authorized user opens `/logistics/commissions`
- **THEN** the page SHALL request `GET /api/v1/commissions`
- **AND** render the returned Commission records.

### Scenario: Manage a contract Commission

- **WHEN** the user creates, reads, or updates a Commission or its annexes
- **THEN** the frontend SHALL use the contract-scoped `/commission` routes
- **AND** SHALL consume `commissionId` from annex responses.

