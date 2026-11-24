// request.url carries the container's bind address (0.0.0.0:3000) behind the reverse proxy,
// so a redirect inside the portal sends a path and lets the browser keep its own host.
export function relativeRedirect(path: string): Response {
  if (!/^\/(?![/\\])/.test(path)) throw new Error('Redirect harus berupa path portal.')
  return new Response(null, { status: 307, headers: { location: path } })
}
