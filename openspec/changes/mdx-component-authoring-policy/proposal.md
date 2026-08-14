# Proposal: MDX component authoring policy

**Status:** in-progress
**Created:** 2026-08-14

## Why

The project-wide Astryx guidance currently forces every MDX authoring component
through the design system, even when the goal is to copy or closely adapt an
open-source component from react.dev. That can change the source component's
semantics, behavior, and visual structure without adding product value.

## What changes

- Make Astryx optional for components exposed through `useMDXComponents`.
- Allow native semantic elements and local React components when adapting
  react.dev MDX UI.
- Keep a small set of neutral Astryx layout and typography primitives available
  when they preserve the source design.
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
