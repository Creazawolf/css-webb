/**
 * Platshållare som visas medan en modul strömmas in.
 *
 * Måtten speglar den färdiga modulen så att layouten inte hoppar när
 * innehållet landar (CLS). Formerna följer den redaktionella dräkten:
 * hårfin ram, 6px radie och ingen skugga — annars byter sidan utseende
 * i samma ögonblick som innehållet kommer.
 */

const WRAP = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'

const CARD = 'overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))]'

function SectionShell({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <section className={`${WRAP} py-12 sm:py-16`} aria-busy="true" aria-label={label}>
      {/* Samma linje som SectionHeading ritar — den ska inte flytta sig. */}
      <div className="mb-7 border-b-2 border-[rgb(var(--color-text))] pb-[22px]">
        <div className="skeleton h-[26px] w-52" />
        <div className="skeleton mt-[9px] h-3.5 w-72 max-w-full" />
      </div>
      {children}
    </section>
  )
}

function CardSkeleton() {
  return (
    <div className={CARD}>
      <div className="skeleton aspect-[416/260] w-full" />
      <div className="px-5 pb-[22px] pt-5">
        <div className="skeleton h-2.5 w-24" />
        <div className="skeleton mt-3.5 h-[19px] w-full" />
        <div className="skeleton mt-2 h-[19px] w-3/5" />
        <div className="skeleton mt-4 h-3 w-28" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section
      className={`${WRAP} py-10 lg:py-14`}
      aria-busy="true"
      aria-label="Laddar toppnyheter"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div>
          <div className="skeleton aspect-[884/497] w-full" />
          <div className="skeleton mt-[22px] h-3 w-32" />
          <div className="skeleton mt-3.5 h-[44px] w-full lg:h-[52px]" />
          <div className="skeleton mt-2.5 h-[44px] w-4/5 lg:h-[52px]" />
          <div className="skeleton mt-4 h-4 w-full max-w-[740px]" />
          <div className="skeleton mt-2 h-4 w-2/3 max-w-[740px]" />
        </div>

        <div>
          <div className="skeleton mb-4 h-3.5 w-28" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-[rgb(var(--color-rule))] py-[18px]">
              <div className="skeleton h-2.5 w-20" />
              <div className="skeleton mt-2 h-[18px] w-full" />
              <div className="skeleton mt-2 h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MatchCenterSkeleton() {
  return (
    <section aria-busy="true" aria-label="Laddar matchcenter">
      <div className={`${WRAP} flex justify-end pb-6`}>
        <div className="skeleton h-[52px] w-[232px]" />
      </div>

      {/* Resultattavlan ligger på nattblå botten hela vägen ut. */}
      <div className="bg-[rgb(var(--color-night))]">
        <div className={`${WRAP} grid grid-cols-1 md:grid-cols-2`}>
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-[22px] py-7">
              <div className="h-11 w-11 shrink-0 rounded-full bg-white/[0.12]" />
              <div className="h-9 w-24 rounded bg-white/[0.12]" />
              <div className="h-11 w-11 shrink-0 rounded-full bg-white/[0.12]" />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${WRAP} grid grid-cols-1 items-start gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_360px]`}
      >
        <div className="min-w-0">
          <div className="border-b-2 border-[rgb(var(--color-text))] pb-4">
            <div className="skeleton h-4 w-48" />
          </div>
          <div className="mt-5 space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-8 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SectionShell label="Laddar nyheter">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </SectionShell>
  )
}

export function ChelseaNewsSkeleton() {
  return (
    <SectionShell label="Laddar nyheter från Chelsea FC">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className={`${CARD} lg:col-span-3`}>
          <div className="skeleton min-h-[260px] w-full lg:min-h-[340px]" />
        </div>
        <div className={`${CARD} divide-y divide-[rgb(var(--color-rule))] lg:col-span-2`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="skeleton h-14 w-20 shrink-0" />
              <div className="flex-1">
                <div className="skeleton h-2.5 w-16" />
                <div className="skeleton mt-2 h-3.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

export function PodcastSkeleton() {
  return (
    <section
      className={`${WRAP} py-12 sm:py-16`}
      aria-busy="true"
      aria-label="Laddar ChelseaPodden"
    >
      <div className="rounded-md bg-[rgb(var(--color-night))] p-6 sm:p-8">
        <div className="h-4 w-40 rounded bg-white/[0.12]" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="h-[180px] rounded bg-white/[0.08] lg:col-span-2" />
          <div className="space-y-3 lg:col-span-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded bg-white/[0.08]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function StripSkeleton() {
  return (
    <div className={`${WRAP} py-4`} aria-busy="true">
      <div className="skeleton h-16 w-full" />
    </div>
  )
}
