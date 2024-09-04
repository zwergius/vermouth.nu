import type { ActionReturn } from 'svelte/action'
import { browser } from '$app/environment'
let intersectionObserver: IntersectionObserver

function ensureIntersectionObserver(hiddenClassName: string) {
  if (intersectionObserver) return

  const rootTop = window.getComputedStyle(document.body).getPropertyValue('--header-height')

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { intersectionRatio, isIntersecting, target } = entry

        const isHidden = target.classList.contains(hiddenClassName)
        if (isIntersecting && intersectionRatio === 1 && isHidden) {
          entry.target.dispatchEvent(new CustomEvent('enterViewport'))
        }

        if (!isIntersecting && !isHidden) {
          entry.target.dispatchEvent(new CustomEvent('exitViewport'))
        }
        // console.log({ intersectionRatio, isIntersecting, isHidden })
      })
    },
    { rootMargin: `${rootTop} 0px 0px 0px`, threshold: [0.5, 1] },
  )
}

export default function viewport(
  element: HTMLElement,
  { hiddenClassName = 'opacity-0' } = { hiddenClassName: 'opacity-0' },
): ActionReturn<null, Attributes> | undefined {
  if (browser) {
    const { matches: supportsHover } = window.matchMedia('(hover: hover)')
    if (supportsHover) return

    ensureIntersectionObserver(hiddenClassName)

    intersectionObserver.observe(element)

    return {
      destroy() {
        intersectionObserver.unobserve(element)
      },
    }
  }
}

interface Attributes {
  'on:enterViewport': (e: CustomEvent) => void
  'on:exitViewport': (e: CustomEvent) => void
}
