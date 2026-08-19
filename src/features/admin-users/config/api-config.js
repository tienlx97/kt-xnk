// Real auth backend base URL. Duplicated from `features/auth/config/
// api-config.js` rather than imported — features must not import each
// other directly (`harness/structure.rules.cjs`'s `no-feature-to-feature`
// rule), and this constant is too small to be worth promoting to
// `src/shared/` on its own. Override via `NEXT_PUBLIC_API_BASE_URL` in
// `.env.local` for environments other than local dev.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
