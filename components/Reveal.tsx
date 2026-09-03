'use client'

import { useEffect, useRef, useState } from 'react'
import type { ElementType, ReactNode } from 'react'

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
 * Elementet renderas alltid i markup — animationen ändrar bara opacity och
 * transform. Om IntersectionObserver saknas, eller om användaren har valt
 * reducerad rörelse, visas innehållet direkt.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    // Redan i vy vid montering (t.ex. innehåll ovanför mitten) — visa direkt
    // istället för att vänta på en scrollhändelse som kanske aldrig kommer.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-revealed={revealed ? 'true' : 'false'}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
