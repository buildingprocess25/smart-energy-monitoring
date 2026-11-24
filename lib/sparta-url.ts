// Call on the server: the image is built without NEXT_PUBLIC_*, so client components get URLs as props.

const ROLE_SWITCH_ROLES = ['ADMIN', 'AUDITOR']

export function spartaHref(base: string | null | undefined, path: string): string | null {
  const trimmed = base?.trim().replace(/\/+$/, '')
  return trimmed ? `${trimmed}${path}` : null
}

// The SPARTA chooser page. GS users only have this portal, and SPARTA sends them back here.
export function roleSwitchUrl(base: string | null | undefined, role: string): string | null {
  return ROLE_SWITCH_ROLES.includes(role) ? spartaHref(base, '/admin-entry') : null
}
