/**
 * Passes the real client address through to the backend.
 *
 * Every request the API receives comes from this server, so without forwarding
 * it the login rate limiter partitions on the BFF's address — one shared
 * bucket for the whole user base, which is both useless as protection and
 * enough to lock everyone out after a handful of sign-ins.
 *
 * The API only believes this header from proxies it has been told to trust
 * (`ForwardedHeaders:KnownProxies`), so it cannot be spoofed by a caller
 * hitting the API directly.
 *
 * @param {Request} request
 * @returns {Record<string, string>} the header, or nothing when the address is
 *   unknown — better to send no claim than a wrong one.
 */
export function clientAddressHeaders(request) {
  // Whatever sits in front of *this* server already appended the client to
  // `x-forwarded-for`; its first entry is the original caller. `x-real-ip` is
  // the nginx-style single-value equivalent.
  const forwardedFor = request.headers.get('x-forwarded-for');
  const address = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip');

  return address ? { 'x-forwarded-for': address } : {};
}
