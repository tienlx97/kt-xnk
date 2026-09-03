# Tasks

- [x] 1.1 `route-access.js`: `/logistics/countries`/`/logistics/ports`
      rules (`logistics:contracts:view`) before the existing `/logistics`
      rule
- [x] 1.2 `sidebarLogistics.json`: "Nước"/"Cảng" entries
- [x] 1.3 Components: `CountriesList`, `CountryFormDialog`, `PortsList`
      (with an optional country filter `Selector`), `PortFormDialog`
- [x] 1.4 Routes: `app/(protected)/logistics/{countries,ports}/page.jsx`
- [x] 1.5 `index.js`: export `CountriesList`/`PortsList`
- [x] 1.6 `pnpm lint`/`typecheck`/`structure`/`test`/`build`/
      `quality-thresholds` all green; `./harness/verify.sh`
- [x] 1.7 Live browser verification against the local BE-kt-xnk Docker API
      (create country, create port, confirm both appear in their own list
      AND in the Contract form's Country/Port pickers)
