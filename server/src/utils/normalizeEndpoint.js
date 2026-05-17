/**
 * Appwrite API base is https://<host>/v1 — users often paste that full URL.
 * Health checks use GET {host}/v1/health, so strip a trailing /v1 from the stored endpoint.
 */
export const normalizeAppwriteEndpoint = (endpoint) => {
  let base = endpoint.trim().replace(/\/+$/, "");
  base = base.replace(/\/v1$/i, "");
  return base;
};
