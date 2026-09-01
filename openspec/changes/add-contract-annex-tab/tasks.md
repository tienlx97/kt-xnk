# Tasks

- [x] 1.1 `types/index.js`: `ContractAnnexType`/`ContractAnnex`/
      `ContractAnnexFormValues` typedefs
- [x] 1.2 `config/contract-annex-types.js` (fixed type set + Vietnamese
      labels), `config/contract-annex-schema.js` (zod)
- [x] 1.3 `api/contract-annexes.js`: list/create/update against the
      nested `/api/v1/contracts/{contractId}/annexes...` routes
- [x] 1.4 `hooks/use-contract-annexes-query.js` (per-contract list query
      + create/update mutations), `hooks/use-contract-annex-form.js`
      (create-or-update form state)
- [x] 1.5 `components/contract-annex-fields.jsx`,
      `components/contract-annex-form-dialog.jsx`
- [x] 1.6 `components/contracts-list.jsx`: `annex` `ExpandedTab`, per-
      contract annex query, "Phụ lục" `Tab` (disabled + `TabList.onChange`
      guard when zero annexes, count `endContent`), annex `List` panel
      with per-row edit, always-enabled "Thêm phụ lục" button in the
      bottom action row, create/edit dialogs
- [x] 1.7 `pnpm lint` / `pnpm typecheck` / `pnpm test` clean;
      `./harness/verify.sh` full pass
- [x] 1.8 Live verification: confirmed via the already-running dev
      server's compile log that the edited files hot-reload with no
      runtime error after each change — no browser/Playwright tool was
      available in this environment to click through the actual UI (same
      gap logged in `wire-contract-country-port-and-field-renames`); an
      unauthenticated `curl` against `/logistics/contracts` returned the
      expected 307 to `/login`, confirming the route itself still
      resolves.
- [x] 1.9 `harness/PROGRESS.md` entry
