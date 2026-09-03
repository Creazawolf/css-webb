'use client'

import { useRowLabel } from '@payloadcms/ui'

type NavRow = {
  label?: string
  link?: string
}

/**
 * Etikett på hopfällda menyrader, så att listan går att läsa utan att
 * öppna varje rad.
 */
export function NavRowLabel() {
  const { data, rowNumber } = useRowLabel<NavRow>()

  const label = data?.label?.trim()
  if (!label) return <span>Menyval {String((rowNumber ?? 0) + 1)}</span>

  return (
    <span>
      {label}
      {data?.link ? <span style={{ opacity: 0.5 }}> — {data.link}</span> : null}
    </span>
  )
}
