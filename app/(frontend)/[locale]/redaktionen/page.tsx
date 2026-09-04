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
    <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-[680px]">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Föreningen
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          Redaktionen
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Allt på den här sajten skrivs av medlemmar, på fritiden, för att vi
          älskar Chelsea. Här är personerna bakom texterna och podden.
        </p>
      </header>

      {team.length === 0 ? (
        <div className="mt-12 rounded-md border border-dashed border-[rgb(var(--color-rule-ctl))] bg-[rgb(var(--color-card))] px-6 py-14 text-center">
          <p className="font-serif text-[16px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
            Redaktionen är inte presenterad ännu.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, i) => {
            const avatar = mediaUrl(person.avatar, 'thumbnail')

            return (
              <Reveal key={person.id} className="h-full" delay={Math.min(i, 5) * 60}>
                <article className="card-lift flex h-full flex-col items-center rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6 py-8 text-center">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt=""
                      width={88}
                      height={88}
                      className="rounded-full object-cover"
                      style={{ height: 88, width: 88 }}
                    />
                  ) : (
                    <div className="font-display flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[rgb(var(--color-chelsea-blue-dark))] text-[26px] font-bold leading-none text-white">
                      {person.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <h2 className="font-display mt-5 text-[20px] font-semibold leading-[1.24] tracking-[0.005em] text-[rgb(var(--color-text))]">
                    {person.name}
                  </h2>
                  {person.title && (
                    <p className="mt-2 text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-gold-ink))]">
                      {person.title}
                    </p>
                  )}
                  {person.bio && (
                    <p className="font-serif mt-4 flex-1 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
                      {person.bio}
                    </p>
                  )}
                  {person.supporterSince && (
                    <p className="mt-5 w-full border-t border-[rgb(var(--color-rule))] pt-4 text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
                      Blå sedan {person.supporterSince}
                    </p>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      )}

      <div className="mt-16 flex flex-col gap-8 rounded-lg bg-[rgb(var(--color-chelsea-blue))] px-7 py-10 text-white sm:px-12 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display max-w-[620px] text-[26px] font-bold leading-[1.08] tracking-[-0.005em] sm:text-[34px]">
            Vill du skriva för oss?
          </h2>
          <p className="font-serif mt-3 max-w-[560px] text-[15.5px] leading-[1.6] text-white/[0.82]">
            Vi tar alltid emot fler skribenter — referat, krönikor, analyser eller
            något helt eget. Hör av dig så sätter vi upp ett konto åt dig.
          </p>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-[44px] flex-none items-center justify-center self-start rounded-md bg-[rgb(var(--color-gold))] px-[26px] py-4 text-[13px] font-bold uppercase leading-none tracking-[0.08em] text-[rgb(var(--color-chelsea-blue-dark))] transition-colors hover:bg-[rgb(var(--color-gold-light))] lg:self-auto"
        >
          Kontakta redaktionen
        </a>
      </div>
    </div>
  )
}
