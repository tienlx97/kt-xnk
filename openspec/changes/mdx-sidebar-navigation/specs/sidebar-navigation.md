# Spec: Sidebar content navigation

## Requirement: MDX collections are navigable from the sidebar

The user CAN expand Tutorial and Blog to access their registered MDX articles.

### Scenario: Browse a collection

- **GIVEN** the sidebar is visible
- **WHEN** the user opens Tutorial or Blog from the top navigation
- **THEN** the sidebar switches to that collection
- **AND** it shows a collection overview followed by every registered article using its frontmatter title
- **AND** links from the other collection are not shown

### Scenario: Read an article

- **GIVEN** the user is on a Tutorial or Blog article route
- **WHEN** the sidebar renders
- **THEN** the containing collection is shown and the current article is selected

### Scenario: Show optional reference headings

- **GIVEN** reference headings are configured for the sidebar
- **WHEN** the sidebar renders
- **THEN** each heading appears with a divider after the navigation links
- **AND** no heading or divider is rendered when the configuration is omitted or empty

### Scenario: Reach content collections from the top navigation

- **GIVEN** the protected application shell is visible
- **WHEN** the top navigation renders
- **THEN** Tutorial and Blog appear as top-level pill links
- **AND** the link containing the current route is highlighted

### Scenario: Hide content navigation outside collections

- **GIVEN** the current route is not Tutorial, Blog, or one of their descendants
- **WHEN** the application shell renders
- **THEN** no sidebar column or sidebar mobile drawer is rendered

### Scenario: Show the containing Docs group in article breadcrumbs

- **GIVEN** a Docs article belongs to a group in the sidebar registry
- **WHEN** its MDX page heading renders
- **THEN** the breadcrumbs show Docs followed by the containing group
- **AND** the article title is not duplicated in the breadcrumb trail

### Scenario: Emphasize an informational note in MDX

- **GIVEN** an MDX article contains a `Note`
- **WHEN** the article renders on desktop or mobile
- **THEN** the note presents an icon, a concise title, and its body as one visually distinct region
- **AND** the complete note remains visible without client-side interaction
