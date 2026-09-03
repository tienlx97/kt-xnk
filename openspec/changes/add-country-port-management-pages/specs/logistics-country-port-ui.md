# Spec: Country/Port Management Pages

## ADDED Requirements

### Requirement: Country management page
Users with `logistics:contracts:view` SHALL be able to view the Country
catalog at `/logistics/countries`, and create a new Country (requires
`logistics:contracts:manage` on the backend; a 403 surfaces as a form
error).

#### Scenario: List countries
- **WHEN** an authorized user opens `/logistics/countries`
- **THEN** the page shows a table of all countries in the catalog (Name)

#### Scenario: Create a country
- **WHEN** the user clicks "Thêm nước", fills in a Name, and submits
- **THEN** the country is created and appears in the list without a
  manual refresh

### Requirement: Port management page
Users with `logistics:contracts:view` SHALL be able to view the Port
catalog at `/logistics/ports`, optionally filtered by Country, and create
a new Port (requires `logistics:contracts:manage` on the backend).

#### Scenario: List ports
- **WHEN** an authorized user opens `/logistics/ports`
- **THEN** the page shows a table of all ports (Name, Country)

#### Scenario: Filter ports by country
- **WHEN** the user selects a Country in the filter
- **THEN** only ports belonging to that Country are shown

#### Scenario: Create a port
- **WHEN** the user clicks "Thêm cảng", fills in a Name and picks a
  Country, and submits
- **THEN** the port is created and appears in the list without a manual
  refresh

### Requirement: Shared cache with the Contract form
Countries/Ports created from their own management page SHALL be
immediately available in the Contract form's Country/Port pickers, since
both read through the same `useCountriesQuery()`/`usePortsQuery()`
TanStack Query cache key that the create mutations already invalidate.
