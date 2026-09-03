'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Fördröjning i ms, för att trappa in flera element efter varandra. */
  delay?: number
  /** Elementtyp att rendera. Default 'div'. */
  as?: ElementType
  className?: string
}

/**
 * Animerar in innehåll när det scrollas in i vy.
 *
 * Avslöjningen skrivs direkt till DOM:en istället för via React-state:
 * det är rent visuellt, händer en enda gång per element, och slipper en
 * omrendering per kort när en lista med tjugo artiklar rullar förbi.
 *
 * Innehållet finns alltid i markup — bara opacity och transform ändras. Utan
 * IntersectionObserver, eller med reducerad rörelse, visas det direkt.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reveal = () => node.setAttribute('data-revealed', 'true')

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal()
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    observer.observe(node)

    // Skyddsnät: skulle observern aldrig trigga (udda layout, element som
    // aldrig korsar tröskeln) visas innehållet ändå efter en stund. En
    // animation får aldrig vara det som avgör om text syns.
    const failsafe = window.setTimeout(() => {
      reveal()
      observer.disconnect()
    }, 2500)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-revealed="false"
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
