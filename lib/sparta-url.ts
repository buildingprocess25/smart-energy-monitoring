// NEXT_PUBLIC_* is inlined at build time, so client components can import this too.
export const SPARTA_AUDIT_URL =
  process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL?.replace(/\/+$/, '') || null

// ADMIN and AUDITOR come from the SPARTA chooser page, so links return there.
export const SPARTA_ENTRY_URL = SPARTA_AUDIT_URL ? `${SPARTA_AUDIT_URL}/admin-entry` : null

// GS users only have this portal; SPARTA pages send them back here.
export function canReturnToSparta(role: string): boolean {
  return SPARTA_ENTRY_URL !== null && role !== 'GS'
}
