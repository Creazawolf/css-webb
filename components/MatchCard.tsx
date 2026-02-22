type MatchCardProps = {
  motstandare: string
  datum: string
  tid: string
  tavling: string
}

export default function MatchCard({ motstandare, datum, tid, tavling }: MatchCardProps) {
  return (
    <article className="rounded-xl border border-[#034694]/15 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="inline-flex rounded-full bg-[#D4A843] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#022B5C]">
        Nästa match
      </span>
      <h3 className="mt-4 text-2xl font-bold text-[#022B5C]">Chelsea vs {motstandare}</h3>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-[#034694]">Datum</dt>
          <dd>{datum}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#034694]">Tid</dt>
          <dd>{tid}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#034694]">Tävling</dt>
          <dd>{tavling}</dd>
        </div>
      </dl>
    </article>
  )
}
