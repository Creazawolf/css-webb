type NewsCardProps = {
  titel: string
  ingress: string
  datum: string
}

export default function NewsCard({ titel, ingress, datum }: NewsCardProps) {
  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))]">
      <div className="aspect-[416/260] w-full bg-[rgb(var(--color-chelsea-blue-dark))]" />
      <div className="flex flex-1 flex-col px-5 pb-[22px] pt-5">
        <p className="text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
          Nyhet
        </p>
        <h3 className="font-display mt-2.5 text-[20px] font-semibold leading-[1.24] tracking-[0.005em] text-[rgb(var(--color-text))]">
          {titel}
        </h3>
        <p className="font-serif mt-2.5 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
          {ingress}
        </p>
        <p className="mt-auto pt-4 text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
          {datum}
        </p>
      </div>
    </article>
  )
}
