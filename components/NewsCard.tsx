type NewsCardProps = {
  titel: string
  ingress: string
  datum: string
}

export default function NewsCard({ titel, ingress, datum }: NewsCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-video w-full bg-gradient-to-br from-[#0A5BB5]/30 to-[#034694]/60" />
      <div className="space-y-3 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#034694]">Nyhet • {datum}</p>
        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#034694]">{titel}</h3>
        <p className="text-sm text-slate-600">{ingress}</p>
      </div>
    </article>
  )
}
