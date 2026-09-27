export function markPrivateResponse<T extends Response>(response: T): T {
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
