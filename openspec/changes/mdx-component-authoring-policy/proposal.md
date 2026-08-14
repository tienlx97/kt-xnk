# Proposal: MDX component authoring policy

**Status:** complete
**Created:** 2026-08-14

## Why

The project-wide Astryx guidance currently forces every MDX authoring component
through the design system, even when the goal is to copy or closely adapt an
open-source component from react.dev. That can change the source component's
semantics, behavior, and visual structure without adding product value.

## What changes

- Prohibit Astryx imports throughout the component tree exposed through
  `useMDXComponents`.
- Allow native semantic elements and local React components when adapting
  react.dev MDX UI.
- Use local StyleX variables backed by the app theme's public CSS properties.
- Preserve all existing StyleX, token, accessibility, architecture, and
  Server/Client Component requirements.

## Out of scope

- Relaxing Astryx requirements for application UI outside the MDX component map.
- Rewriting any existing MDX component solely to exercise the new policy.
- Relaxing StyleX, theme-token, accessibility, or architecture rules.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-14 | Scope the exception to components exposed through `useMDXComponents` | The requested freedom is for react.dev-inspired MDX UI, not the whole application. |
| 2026-08-15 | Strengthen “optional” to “no Astryx imports” for the complete MDX tree | The user requested full react.dev component parity with StyleX as the adaptation layer and explicitly excluded Astryx. |
