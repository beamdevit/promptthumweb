'use client'

import type { ReactNode } from 'react'
import { th } from 'date-fns/locale/th'

// date-fns only calls localize.ordinalNumber(year, { unit: 'year' }) for the `yo` token,
// so using `yo` in a date pattern prints the Buddhist year (พ.ศ.) without touching other tokens.
const localize = th.localize as unknown as { ordinalNumber: (n: number, o?: { unit?: string }) => string }
if (!(localize.ordinalNumber as { __be?: boolean }).__be) {
  const original = localize.ordinalNumber
  const patched = (n: number, o?: { unit?: string }) =>
    o?.unit === 'year' ? String(n + 543) : original(n, o)
  ;(patched as { __be?: boolean }).__be = true
  localize.ordinalNumber = patched
}

export function BuddhistYearProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
