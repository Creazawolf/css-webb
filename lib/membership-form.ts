/**
 * Delad typ och startvärde för medlemsformuläret.
 *
 * Ligger avsiktligt utanför actions.ts: en modul med 'use server' får bara
 * exportera async-funktioner, så ett vanligt objekt därifrån når aldrig
 * klienten intakt.
 */

export type ApplicationState = {
  status: 'idle' | 'success' | 'error'
  message: string
  /** Fältnamn → felmeddelande. */
  errors: Record<string, string>
}

export const initialApplicationState: ApplicationState = {
  status: 'idle',
  message: '',
  errors: {},
}
