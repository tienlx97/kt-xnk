# Tasks

- [x] 1.1 `Country` catalog: `api/countries.js`, `use-countries-query.js`,
      `config/country-schema.js`, `country-fields.jsx`,
      `quick-create-country-dialog.jsx`
- [x] 1.2 `Port` catalog: `api/ports.js`, `use-ports-query.js`,
      `config/port-schema.js`, `port-fields.jsx`,
      `quick-create-port-dialog.jsx`
- [x] 1.3 `types/index.js`: rename `PartyA`→`Buyer`-flavored typedefs,
      `Contract`/`ContractFormValues` field renames, add `Country`/`Port`
      typedefs, add `note`/`countryId`
- [x] 1.4 `api/contracts.js`: wire renames (`CountryId`, `PlaceOfLoading`,
      `PlaceOfDischarge`, `Buyer`, `Note`)
- [x] 1.5 `config/contract-schema.js`: `countryId` rule, renamed place
      fields, optional `note`, `quotationDate <= createdDate` refine
- [x] 1.6 `hooks/use-contract-form.js`: Buyer-flavored renames, `countryId`
      + `note` state
- [x] 1.7 `components/party-a-fields.jsx` → `buyer-fields.jsx`
      (`BuyerFields`)
- [x] 1.8 `components/contract-form-dialog.jsx`: Country Selector +
      quick-create, renamed place fields, `Note` TextArea, Buyer section
      title
- [x] 1.9 `components/contracts-list.jsx`: Buyer label, country
      lookup-by-id display
- [x] 1.10 Tests: `api/contracts.test.js` renamed-key assertions + new
      `CountryId`/`Note` coverage; new schema test for the quotation-date
      rule (`config/contract-schema.test.js`, new file)
- [x] 1.11 `./harness/verify.sh` full pass (96 unit tests, +12 vs. the 84
      baseline)
- [x] 1.12 Live verification against BE-kt-xnk — partial: confirmed the
      Docker API is up, login works, `GET /api/v1/countries` returns the
      documented `{id, name}` shape our `api/countries.js` expects. Full
      round-trip (create country → port → contract with `CountryId`/
      `Buyer`/`Note`) was blocked by the login endpoint's 15-minute rate
      limiter after a few attempts, and no browser/Playwright tool was
      available in this environment to drive the actual UI — see
      PROGRESS.md for the honest gap.
- [x] 1.13 `harness/PROGRESS.md` entry
