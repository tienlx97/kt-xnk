# Spec: Logistics Contracts + Customers UI

## Requirement: Logistics side nav

The system SHALL show a "Logistics" side nav with "Hợp đồng"
(`/logistics/contracts`) and "Khách hàng" (`/logistics/customers`) entries
whenever the current route is under `/logistics`.

### Scenario: Viewing a Logistics sub-route

- GIVEN a signed-in visitor navigates to `/logistics/contracts`
- WHEN the page renders
- THEN the side nav SHALL show both "Hợp đồng" and "Khách hàng" links

## Requirement: Route access requires the granular contracts permission

The system SHALL redirect a visitor without `logistics:contracts:view` away
from `/logistics/contracts` or `/logistics/customers`, even if they hold the
broader `logistics:view` permission.

### Scenario: Visitor lacks the contracts permission

- GIVEN a visitor's session permissions include `logistics:view` but not
  `logistics:contracts:view`
- WHEN they navigate directly to `/logistics/contracts`
- THEN `middleware.js` SHALL redirect them to `/`

## Requirement: Creating a contract accepts an existing or inline Party A

The Contract form SHALL let the user pick an existing `Customer` from a
Selector (its fields are snapshotted into the contract on save) or type one
in inline, and SHALL let them quick-add a new `Customer` without leaving the
Contract form.

### Scenario: Quick-adding a customer from the Contract form

- GIVEN the Contract form's Party A section is open
- WHEN the user opens the quick-add dialog, enters a company name, and
  submits
- THEN the new customer SHALL be created and automatically selected as
  Party A in the Contract form, without closing the Contract form

## Requirement: Payment terms must sum to 100%

The Contract form SHALL block submission client-side when the sum of every
payment term's percentage does not equal 100, showing the running total.

### Scenario: Terms don't sum to 100

- GIVEN the user has entered payment terms summing to 60%
- WHEN they attempt to submit the form
- THEN the form SHALL show a validation error and SHALL NOT send a request
