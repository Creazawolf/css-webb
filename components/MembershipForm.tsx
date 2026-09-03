'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitMembershipApplication } from '@/app/(frontend)/[locale]/medlemskap/actions'
import { initialApplicationState } from '@/lib/membership-form'

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#034694] focus:outline-none focus:ring-2 focus:ring-[#034694]/20'

const labelClass = 'block text-[13px] font-semibold text-slate-700'

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null
  return (
    <p className="mt-1 text-[12px] font-medium text-red-600" role="alert">
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
      className="inline-flex items-center justify-center rounded-md bg-[#034694] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#022B5C] disabled:cursor-not-allowed disabled:opacity-60"
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
        className="rounded-xl border border-green-200 bg-green-50 p-6 text-center"
        role="status"
      >
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-600">
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
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-[#022B5C]">
          Ansökan mottagen
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-slate-600">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.status === 'error' && state.message && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Namn <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${inputClass} mt-1.5`}
            aria-invalid={Boolean(state.errors.name)}
          />
          <FieldError message={state.errors.name} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-post <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${inputClass} mt-1.5`}
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
            className={`${inputClass} mt-1.5`}
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
            className={`${inputClass} mt-1.5`}
          />
          <p className="mt-1 text-[12px] text-slate-400">
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
          className={`${inputClass} mt-1.5`}
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
          className={`${inputClass} mt-1.5 resize-y`}
          placeholder="Något du vill berätta? Hur länge har du hållit på Chelsea?"
        />
      </div>

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          name="newsletter"
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#034694] focus:ring-[#034694]"
        />
        <span className="text-[13px] leading-relaxed text-slate-600">
          Ja tack, skicka mig föreningens nyhetsbrev.
        </span>
      </label>

      {/* Honungsfälla mot bottar — dold för både syn och skärmläsare. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Lämna tomt</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="pt-2">
        <SubmitButton />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          Vi sparar bara namn, kontaktuppgifter och ort — inget personnummer.
          Uppgifterna används enbart för medlemsadministration och du kan när som
          helst be oss radera dem.
        </p>
      </div>
    </form>
  )
}
