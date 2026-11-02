import { describe, expect, it } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render } from 'svelte/server'
import Hero from './hero.svelte'

const children = createRawSnippet(() => ({ render: () => '<span>Vermouth</span>' }))

describe('Hero', () => {
  it('serves distinct artwork without cropping or an empty heading', () => {
    const { body } = render(Hero, {
      props: {
        images: [
          {
            desktop: 'https://images.example/desktop',
            tablet: 'https://images.example/tablet',
            mobile: 'https://images.example/mobile',
          },
        ],
        alt: 'Sardino Rojo offer',
      },
    })

    expect(body).toContain('media="(min-width: 1024px)"')
    expect(body).toContain('media="(min-width: 768px)"')
    for (const artwork of ['desktop', 'tablet', 'mobile']) {
      expect(body).toContain(`https://images.example/${artwork}/w=400 400w`)
      expect(body).toContain(`https://images.example/${artwork}/w=2400 2400w`)
    }
    expect(body).not.toContain('fit=cover')
    expect(body).not.toContain('brightness-90')
    expect(body).toContain('alt="Sardino Rojo offer"')
    expect(body).toContain('fetchpriority="high"')
    expect(body).not.toContain('<h1')
    expect(body).not.toContain('Vermouth')
  })

  it('supports screen-reader offer text without repeating it in the image alt', () => {
    const offer = 'Sardino Rojo – klasse vermouth til kongepris. Spar 34%, kun 119,-.'
    const { body } = render(Hero, {
      props: {
        images: [{ desktop: 'https://images.example/offer' }],
        alt: '',
        children: createRawSnippet(() => ({
          render: () => `<span class="sr-only">${offer}</span>`,
        })),
      },
    })

    expect(body).toContain('alt=""')
    expect(body).toContain(`<span class="sr-only">${offer}</span>`)
    expect(body.split(offer)).toHaveLength(2)
  })

  it('preserves the original single-image crop, dimming, and visible heading', () => {
    const { body } = render(Hero, {
      props: { children, images: [{ desktop: 'https://images.example/original' }] },
    })

    expect(body).toContain('media="(min-width: 480px)"')
    expect(body).toContain('https://images.example/original/w=800,h=324,fit=cover 800w')
    expect(body).toContain('https://images.example/original/w=400,h=421,fit=cover 400w')
    expect(body).toContain('brightness-90')
    expect(body).toContain('aspect-[0.95/1] md:aspect-[2.47/1]')
    expect(body).not.toContain('responsive-hero-image')
    expect(body).toContain('<h1 class="h1 absolute')
    expect(body).not.toContain('sr-only')
  })
})
