import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
import { mediaUrl } from '@/lib/posts'
import { getSiteConfig } from '@/lib/site'
import type { User } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Redaktionen',
  description:
    'Personerna bakom Chelsea Supporters Sweden — skribenter, poddare och styrelse.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

/**
 * Läser redaktionen med `overrideAccess`.
 *
 * Users har `read: isLoggedIn` för att skydda e-postadresser, men de fält vi
 * visar här (namn, roll, presentation, bild) är avsedda att vara publika —
 * så vi väljer explicit ut just dem.
 */
async function getTeam(): Promise<User[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { showInTeam: { equals: true } },
      sort: 'name',
      limit: 100,
      depth: 1,
      overrideAccess: true,
      select: {
        name: true,
        title: true,
        bio: true,
        avatar: true,
        supporterSince: true,
        role: true,
      },
    })
    return result.docs as User[]
  } catch {
    return []
  }
}

export default async function RedaktionenPage({ params }: PageProps) {
  const { locale } = await params
  const [team, site] = await Promise.all([getTeam(), getSiteConfig(locale)])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Redaktionen
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Allt på den här sajten skrivs av medlemmar, på fritiden, för att vi
          älskar Chelsea. Här är personerna bakom texterna och podden.
        </p>
      </div>

      {team.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
          <p className="text-[14px] text-slate-500">
            Redaktionen är inte presenterad ännu.
          </p>
        </div>
      ) : (
        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, i) => {
            const avatar = mediaUrl(person.avatar, 'thumbnail')

            return (
              <Reveal key={person.id} delay={Math.min(i, 5) * 60}>
                <article className="card-lift flex h-full flex-col items-center rounded-xl border border-slate-200/70 bg-white p-6 text-center shadow-[var(--shadow-card)]">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt=""
                      width={88}
                      height={88}
                      className="h-22 w-22 rounded-full object-cover"
                      style={{ height: 88, width: 88 }}
                    />
                  ) : (
                    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br from-[#034694] to-[#022B5C] font-display text-2xl font-bold text-white">
                      {person.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <h2 className="font-display mt-4 text-lg font-bold text-[#022B5C]">
                    {person.name}
                  </h2>
                  {person.title && (
                    <p className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#D4A843]">
                      {person.title}
                    </p>
                  )}
                  {person.bio && (
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-600">
                      {person.bio}
                    </p>
                  )}
                  {person.supporterSince && (
                    <p className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-400">
                      Blå sedan {person.supporterSince}
                    </p>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      )}

      <div className="mt-10 rounded-xl bg-[#022B5C] px-6 py-8 text-center sm:px-10">
        <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
          Vill du skriva för oss?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-[14px] leading-relaxed text-blue-100/70">
          Vi tar alltid emot fler skribenter — referat, krönikor, analyser eller
          något helt eget. Hör av dig så sätter vi upp ett konto åt dig.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-5 inline-block rounded-md bg-[#D4A843] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#022B5C] transition-colors hover:bg-[#E8C96A]"
        >
          Kontakta redaktionen
        </a>
      </div>
    </div>
  )
}
