const MONTHS_SV = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
]

/**
 * Swedish date formatting with "Idag" / "Igår" support.
 *
 *  - Today     → "Idag, 14:30"
 *  - Yesterday → "Igår, 09:15"
 *  - Same year → "15 feb, 09:14"
 *  - Other year → "15 feb 2025"
 */
export function formatDateSv(isoString: string): string {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const time = `${hh}:${mm}`

  if (date >= todayStart) {
    return `Idag, ${time}`
  }
  if (date >= yesterdayStart) {
    return `Igår, ${time}`
  }

  const day = date.getDate()
  const month = MONTHS_SV[date.getMonth()]

  if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${month}, ${time}`
  }

  return `${day} ${month} ${date.getFullYear()}`
}
