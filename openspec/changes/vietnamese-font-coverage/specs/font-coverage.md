# Spec: Vietnamese font coverage

## Requirement: Vietnamese text stays in the configured Optimistic family

Vietnamese body and display text MUST render without falling back to a system
font at every configured normal and italic weight.

### Scenario: Render normalized Vietnamese text

- **GIVEN** Vietnamese text is encoded in NFC
- **WHEN** it renders in Optimistic Text or Optimistic Display
- **THEN** all Vietnamese letters use a custom Optimistic face
- **AND** normal and italic styles are available at every configured weight

### Scenario: Render decomposed Vietnamese text

- **GIVEN** Vietnamese text is encoded in NFD with combining marks
- **WHEN** it renders in Optimistic Text or Optimistic Display
- **THEN** each grapheme cluster stays within one custom font face
- **AND** no glyph is supplied by a system fallback font

### Scenario: Render a character outside the Vietnamese subset

- **GIVEN** content contains a character absent from the Vietnamese face
- **WHEN** the browser resolves the theme font stack
- **THEN** it tries the matching upstream Western Optimistic family before the
  system sans-serif fallbacks
