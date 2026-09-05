# Formatted number input interface

## Requirement: Numeric business fields format while users type

Money, ratio, quantity, and weight form fields MUST use the common Astryx
`TextInput` editing control and MUST emit `number | undefined` to existing form
state.

### Scenario: Product grouping convention

- GIVEN a user edits a money, ratio, quantity, or weight field
- WHEN they enter `1`, `1234`, `12345`, `123456.78`, or `123456789.11`
- THEN the field displays `1`, `123,4`, `123,45`, `123,456.78`, or
  `123,456,789.11`, respectively

### Scenario: Decimal draft

- GIVEN a user has entered an integer amount
- WHEN they enter a decimal point
- THEN the decimal point remains visible so up to eight decimal digits can
  follow

### Scenario: Extended decimal precision

- GIVEN a user is editing a numeric business field
- WHEN they enter between three and eight digits after the decimal point
- THEN every entered decimal digit remains visible and is emitted to form state

### Scenario: Year inputs

- GIVEN a field represents a year
- THEN it continues to use the numeric input behavior appropriate to that value
