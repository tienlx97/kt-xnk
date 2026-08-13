# Spec: Sidebar content navigation

## Requirement: MDX collections are navigable from the sidebar

The user CAN expand Tutorial and Blog to access their registered MDX articles.

### Scenario: Browse a collection

- **GIVEN** the sidebar is visible
- **WHEN** the user expands Tutorial or Blog
- **THEN** links for every registered article appear using its frontmatter title
- **AND** the entire parent navigation row toggles the collection

### Scenario: Read an article

- **GIVEN** the user is on a Tutorial or Blog article route
- **WHEN** the sidebar renders
- **THEN** the containing collection is expanded and the current article is selected

### Scenario: Show optional reference headings

- **GIVEN** reference headings are configured for the sidebar
- **WHEN** the sidebar renders
- **THEN** each heading appears with a divider after the navigation links
- **AND** no heading or divider is rendered when the configuration is omitted or empty
