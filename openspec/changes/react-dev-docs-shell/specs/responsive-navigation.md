# Spec: React.dev-compatible responsive navigation

## Requirement: Exact breakpoint thresholds

The system SHALL use exact minimum-width thresholds of 374, 640, 768, 1024,
1280, 1536, and 1919px for react.dev-compatible responsive behavior.

### Scenario: Content inset boundary

- **GIVEN** a documentation page at 639px viewport width
- **WHEN** its content geometry is measured
- **THEN** the inline inset is 20px
- **AND WHEN** the viewport changes to 640px
- **THEN** the inline inset is 48px

### Scenario: Navigation mode boundary

- **GIVEN** the viewport is 1023px wide
- **WHEN** the shell renders
- **THEN** mobile navigation is available and desktop SideNav is hidden
- **AND WHEN** the viewport changes to 1024px
- **THEN** mobile navigation closes and the desktop 20rem SideNav appears

## Requirement: Safe mobile overlay lifecycle

The mobile route tree SHALL behave as a full-height accessible overlay without
leaving the document locked after it closes.

### Scenario: Open and close mobile navigation

- **GIVEN** the viewport is below 1024px
- **WHEN** the user opens the menu
- **THEN** background scrolling is locked and the route tree is visible
- **AND WHEN** the user presses Escape, selects a route, or resizes to 1024px
- **THEN** the overlay closes and the previous body scroll state is restored
