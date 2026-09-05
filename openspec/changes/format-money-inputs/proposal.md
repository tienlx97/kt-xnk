# Proposal: Format numeric inputs while typing

**Status:** done
**Created:** 2026-09-05

## Why

Astryx `NumberInput` displays its formatted value only after focus leaves the
field. Staff need money, ratio, quantity, and weight fields to show the
product's grouping convention while they type, including incomplete decimal
drafts.

## What changes

- Introduce a shared Astryx `TextInput` adapter for non-negative numeric values.
- Group integer digits from left to right and retain up to eight decimal digits.
- Keep form and API boundaries numeric; only the editing representation is text.
- Apply the adapter to money, ratio, quantity, and weight fields while retaining
  `NumberInput` for year values.

## Out of scope

Changing read-only number displays, backend payloads, currencies, or year
inputs.
