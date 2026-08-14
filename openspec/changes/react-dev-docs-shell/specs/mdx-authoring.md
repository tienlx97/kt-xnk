# Spec: React.dev-compatible MDX authoring

## Requirement: App Router-compatible parity

The documentation system SHALL reproduce react.dev's observable MDX authoring
and layout contract without adopting its Pages Router, MDX 2, Babel CommonJS,
or React-tree JSON transport implementation.

### Scenario: Ordinary prose

- **GIVEN** trusted documentation MDX contains ordinary headings and paragraphs
- **WHEN** it is compiled and rendered by MDX 3
- **THEN** frontmatter and deterministic TOC data are available
- **AND** ordinary prose renders inside the 56rem `MaxWidth` axis

### Scenario: Full-width authoring block

- **GIVEN** trusted MDX includes a registered full-width component between prose
- **WHEN** the page renders at a wide viewport
- **THEN** the component may use the 80rem content frame
- **AND** prose before and after it returns to the same 56rem reading axis
- **AND** source order is unchanged

## Requirement: Scoped Astryx exemption

The shell and MDX components in this change SHALL NOT be required to use Astryx
UI and MAY use semantic native elements plus StyleX.

### Scenario: Component implementation review

- **GIVEN** a component is part of TopNav, SideNav, Content, TOC, or the MDX map
- **WHEN** its implementation is reviewed
- **THEN** it does not need an Astryx equivalent
- **AND** it still meets accessibility, theme-variable, StyleX, and architecture
  constraints
