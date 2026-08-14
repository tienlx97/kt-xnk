# Spec: Complete react.dev MDX component registry

## Requirement: Exact registry coverage

The local `useMDXComponents` registry MUST expose every key in the pinned
react.dev `MDXComponents` object with compatible authoring props.

### Scenario: Compare registry inventories

- **GIVEN** the pinned upstream registry
- **WHEN** the parity contract test compares its keys with the local registry
- **THEN** no upstream key is absent
- **AND** no key is represented by a non-functional placeholder

## Requirement: Visual and behavioral parity

Each port MUST preserve the corresponding upstream component's semantic DOM,
visible hierarchy, responsive geometry, accessibility, and interactions.

### Scenario: Render static and interactive fixtures

- **GIVEN** representative MDX using every component family
- **WHEN** it renders at the acceptance widths
- **THEN** static structure and computed styles match the pinned reference
- **AND** keyboard, focus, disclosure, navigation, copy, challenge, console,
  and sandbox flows behave equivalently

## Requirement: Local implementation constraints

The implementation MUST remain JavaScript, Next.js App Router, MDX 3, and
StyleX, and the complete registry component tree MUST NOT import Astryx.

### Scenario: Inspect the component tree

- **GIVEN** any module reachable from `useMDXComponents`
- **WHEN** source contracts scan its imports
- **THEN** no `@astryxdesign/core` import exists
- **AND** substantially adapted react.dev modules preserve MIT attribution
