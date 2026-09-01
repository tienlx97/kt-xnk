# Spec: Contract Annex Tab

## Requirement: Annex tab is disabled without any annex

The expanded contract row's `TabList` SHALL include an "Phụ lục" tab that
is disabled (visually and functionally) when the contract has zero
annexes, and enabled — showing a count — once it has at least one.

### Scenario: No annexes yet

- GIVEN a contract with no `ContractAnnex` rows
- WHEN its row is expanded
- THEN the "Phụ lục" tab SHALL render `aria-disabled` and clicking it
  SHALL NOT switch the active tab

### Scenario: At least one annex

- GIVEN a contract with one or more `ContractAnnex` rows
- WHEN its row is expanded
- THEN the "Phụ lục" tab SHALL be clickable, show the annex count as
  `endContent`, and switching to it SHALL list every annex

## Requirement: Creating the first annex does not require the tab to be open

Since the tab is disabled with zero annexes, the panel SHALL offer an
always-enabled "Thêm phụ lục" action (in the bottom action row) that opens
the create-annex dialog regardless of the tab's disabled state.

### Scenario: Creating the first annex

- GIVEN a contract with no annexes
- WHEN the user clicks "Thêm phụ lục" and submits a valid annex
- THEN the annex SHALL be created and the "Phụ lục" tab SHALL become
  enabled, showing the new annex

## Requirement: Annex fields match the backend contract

The annex form SHALL collect `Type` (`AmountIncrease`/`AmountDecrease`/
`ValueChange`), `Amount` (> 0), `SignedDate`, `BuyerSigned`, `SellerSigned`
— never `AnnexNumber`/`AnnexCode`, which the backend assigns.

### Scenario: Editing an existing annex

- GIVEN an existing annex
- WHEN the user opens its edit dialog via the per-row edit button
- THEN the dialog SHALL prefill `Type`/`Amount`/`SignedDate`/
  `BuyerSigned`/`SellerSigned` from that annex and SHALL NOT offer to
  change its `AnnexNumber` or `AnnexCode`
