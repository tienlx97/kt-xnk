# Spec: MDX component authoring

## Requirement: MDX components can preserve react.dev source UI

An agent MUST treat Astryx as optional, rather than mandatory, when implementing
a component exposed through `useMDXComponents`.

### Scenario: Adapt a react.dev MDX component

- **GIVEN** an agent is copying or adapting an MDX UI component from react.dev
- **WHEN** an Astryx control or chrome component would change the source UI
- **THEN** the agent may use native semantic elements or a local component
- **AND** the agent is not required to use Astryx controls such as `Button`
- **AND** the agent may still use `VStack`, `StackItem`, `Stack`, `HStack`,
  `GridSpan`, `Grid`, or `Text` when they preserve the source UI
- **AND** StyleX/theme tokens, accessibility, architecture, and Server/Client
  Component boundaries remain mandatory

### Scenario: Build UI outside the MDX component map

- **GIVEN** an agent is implementing application UI that is not exposed through
  `useMDXComponents`
- **WHEN** the agent selects components
- **THEN** the existing project-wide Astryx component policy still applies
