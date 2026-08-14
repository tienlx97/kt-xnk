# Spec: MDX component authoring

## Requirement: MDX components can preserve react.dev source UI

An agent MUST NOT import Astryx anywhere in the rendered component tree exposed
through `useMDXComponents`.

### Scenario: Adapt a react.dev MDX component

- **GIVEN** an agent is copying or adapting an MDX UI component from react.dev
- **WHEN** implementing the source component's structure and behavior
- **THEN** the agent uses native semantic elements or local React components
- **AND** no module in that component tree imports `@astryxdesign/core`
- **AND** StyleX, public theme CSS variables, accessibility, architecture, and
  Server/Client Component boundaries remain mandatory

### Scenario: Build UI outside the MDX component map

- **GIVEN** an agent is implementing application UI that is not exposed through
  `useMDXComponents`
- **WHEN** the agent selects components
- **THEN** the existing project-wide Astryx component policy still applies
