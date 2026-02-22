type NyhetProps = {
  params: Promise<{ slug: string }>
}

export default async function NyhetPage({ params }: NyhetProps) {
  const { slug } = await params

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#034694]">Nyhetsartikel</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Artikel: {slug}</h1>
      <p className="mt-6 leading-7 text-slate-700">
        Detta ar en platshallare for en individuell nyhetsartikel. Innehall kommer att lasas fran collection
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">posts</code>.
      </p>
    </article>
  )
}
