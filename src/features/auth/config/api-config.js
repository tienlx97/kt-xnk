// Real auth backend base URL. Override via `NEXT_PUBLIC_API_BASE_URL` in
// `.env.local` for environments other than local dev.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
