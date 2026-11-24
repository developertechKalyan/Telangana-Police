/**
 * Base URL of the Node API (auth, gallery, weather), e.g. "https://api.example.gov.in/api".
 *
 * - Local development: http://localhost:8000/api unless VITE_API_URL is set.
 * - Production: set VITE_API_URL in the host's build settings (Netlify: Site settings → Environment
 *   variables), then redeploy. Without it the site calls /api on its own domain, which only works if
 *   the host proxies /api to the API server (see netlify.toml).
 */
export const API_BASE: string = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000/api" : "/api")
).replace(/\/+$/, "");
