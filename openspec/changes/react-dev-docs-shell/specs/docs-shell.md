# Spec: React.dev-compatible documentation shell

## Requirement: Three-region desktop layout

The system SHALL reproduce react.dev's documentation grid while using KT-XNK
content, theme variables, JavaScript, StyleX, and Next.js App Router.

### Scenario: Desktop documentation page

- **GIVEN** an authenticated user visits a documentation route at 1024–1535px
- **WHEN** the page renders
- **THEN** the layout contains a 20rem sidebar and one fluid content column
- **AND** the TOC rail is not displayed

### Scenario: Wide documentation page

- **GIVEN** the viewport is at least 1536px wide
- **WHEN** a documentation page with TOC entries renders
- **THEN** the layout contains a 20rem sidebar, fluid content, and 20rem TOC rail
- **AND** heading and prose share the same 56rem centered axis inside content

## Requirement: Product-specific substitutions

The system SHALL preserve KT-XNK branding, authentication, routes, theme, and
Vietnamese content without changing their react.dev-equivalent layout roles.

### Scenario: Authenticated shell controls

- **GIVEN** an authenticated user views a protected page
- **WHEN** the top navigation renders
- **THEN** the KT-XNK logo, navigation, and user menu are present
- **AND** React-specific language, GitHub, theme, and search controls are absent
