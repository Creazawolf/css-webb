'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitMembershipApplication } from '@/app/(frontend)/[locale]/medlemskap/actions'
import { initialApplicationState } from '@/lib/membership-form'

// Ramen måste nå 3:1 mot papperstonen, och fälten 44px så de går att träffa.
const inputClass =
  'block w-full min-h-[44px] rounded-md border border-[rgb(var(--color-rule-ctl))] bg-[rgb(var(--color-card))] px-3.5 py-3 text-[14px] leading-[1.4] text-[rgb(var(--color-text))] transition-colors placeholder:text-[rgb(var(--color-muted))] focus:border-[rgb(var(--color-chelsea-blue))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-chelsea-blue))]/25'

const labelClass =
  'block text-[11px] font-bold uppercase tracking-[0.14em] text-[rgb(var(--color-muted))]'

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-[12px] font-semibold text-[#B02A1B]" role="alert">
      {message}
    </p>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[rgb(var(--color-chelsea-blue))] px-[26px] py-4 text-[13px] font-bold uppercase leading-none tracking-[0.08em] text-white transition-colors hover:bg-[rgb(var(--color-chelsea-blue-dark))] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Skickar…' : 'Skicka ansökan'}
    </button>
  )
}

export default function MembershipForm() {
  const [state, formAction] = useActionState(
    submitMembershipApplication,
    initialApplicationState,
  )

  if (state.status === 'success') {
    return (
      <div
        className="rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6 py-10 text-center"
        role="status"
      >
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1F7A4C]">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-[26px] font-bold uppercase leading-none tracking-[0.06em] text-[rgb(var(--color-text))]">
          Ansökan mottagen
        </h3>
        <p className="font-serif mx-auto mt-3 max-w-md text-[16px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === 'error' && state.message && (
        <div
          className="rounded-md border border-[#B02A1B]/40 bg-[#B02A1B]/[0.06] px-4 py-3 text-[13px] font-semibold text-[#B02A1B]"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Namn <span className="text-[#B02A1B]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${inputClass} mt-2`}
            aria-invalid={Boolean(state.errors.name)}
          />
          <FieldError message={state.errors.name} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-post <span className="text-[#B02A1B]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${inputClass} mt-2`}
            aria-invalid={Boolean(state.errors.email)}
          />
          <FieldError message={state.errors.email} />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={`${inputClass} mt-2`}
            aria-invalid={Boolean(state.errors.phone)}
          />
          <FieldError message={state.errors.phone} />
        </div>

        <div>
          <label htmlFor="city" className={labelClass}>
            Ort
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            className={`${inputClass} mt-2`}
          />
          <p className="font-serif mt-2 text-[13.5px] leading-[1.5] text-[rgb(var(--color-muted))]">
            Hjälper oss ordna träffar där du bor.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="membershipType" className={labelClass}>
          Typ av medlemskap
        </label>
        <select
          id="membershipType"
          name="membershipType"
          defaultValue="standard"
          className={`${inputClass} mt-2`}
        >
          <option value="standard">Standard</option>
          <option value="familj">Familj</option>
          <option value="ungdom">Ungdom (under 18)</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Meddelande
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${inputClass} font-serif mt-2 resize-y text-[15px] leading-[1.6]`}
          placeholder="Något du vill berätta? Hur länge har du hållit på Chelsea?"
        />
      </div>

      <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="newsletter"
          defaultChecked
          className="h-5 w-5 shrink-0 rounded border-[rgb(var(--color-rule-ctl))] text-[rgb(var(--color-chelsea-blue))] accent-[rgb(var(--color-chelsea-blue))]"
        />
        <span className="font-serif text-[15px] leading-[1.5] text-[rgb(var(--color-ink-2))]">
          Ja tack, skicka mig föreningens nyhetsbrev.
        </span>
      </label>

      {/* Honungsfälla mot bottar — dold för både syn och skärmläsare. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Lämna tomt</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="border-t border-[rgb(var(--color-rule))] pt-6">
        <SubmitButton />
        <p className="font-serif mt-4 max-w-[52ch] text-[13.5px] leading-[1.6] text-[rgb(var(--color-muted))]">
          Vi sparar bara namn, kontaktuppgifter och ort — inget personnummer.
          Uppgifterna används enbart för medlemsadministration och du kan när som
          helst be oss radera dem.
        </p>
      </div>
    </form>
  )
}
