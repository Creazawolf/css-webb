/**
 * Platshållare som visas medan en modul strömmas in.
 *
 * Måtten speglar den färdiga modulen så att layouten inte hoppar när
 * innehållet landar (CLS).
 */

function SectionShell({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <section
      className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label={label}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="section-marker opacity-30" aria-hidden="true" />
        <div className="skeleton h-6 w-40" />
      </div>
      {children}
    </section>
  )
}

export function HeroSkeleton() {
  return (
    <section
      className="mx-auto w-full max-w-[1200px] px-4 pt-5 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Laddar toppnyheter"
    >
      <div className="grid grid-cols-1 gap-[6px] lg:grid-cols-5 lg:grid-rows-2">
        <div className="skeleton min-h-[280px] rounded-l-xl lg:col-span-3 lg:row-span-2 lg:min-h-[420px]" />
        <div className="skeleton min-h-[140px] lg:col-span-2" />
        <div className="skeleton min-h-[140px] rounded-br-xl lg:col-span-2" />
      </div>
    </section>
  )
}

export function MatchCenterSkeleton() {
  return (
    <SectionShell label="Laddar matchcenter">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]"
          >
            <div className="skeleton mx-auto h-3 w-28" />
            <div className="mt-6 flex items-center justify-center gap-5">
              <div className="skeleton h-12 w-12 rounded-full" />
              <div className="skeleton h-9 w-14" />
              <div className="skeleton h-12 w-12 rounded-full" />
            </div>
            <div className="skeleton mx-auto mt-6 h-8 w-32" />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SectionShell label="Laddar nyheter">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-100 bg-white"
          >
            <div className="skeleton aspect-[16/10] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

export function ChelseaNewsSkeleton() {
  return (
    <SectionShell label="Laddar nyheter från Chelsea FC">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="skeleton min-h-[260px] rounded-xl lg:col-span-3 lg:min-h-[340px]" />
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-14 w-20 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-2.5 w-16" />
                <div className="skeleton h-3.5 w-full" />
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
      className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Laddar ChelseaPodden"
    >
      <div className="skeleton h-[420px] rounded-xl lg:h-[360px]" />
    </section>
  )
}

export function StripSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8" aria-busy="true">
      <div className="skeleton h-16 rounded-xl" />
    </div>
  )
}
