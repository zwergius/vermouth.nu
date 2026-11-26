import { describe, expect, it } from 'vitest'
import { getVermouth, vermouths } from './products'

describe('static product data', () => {
  it('resolves a known product handle', () => {
    expect(getVermouth('sardino-rojo')).toBe(vermouths['sardino-rojo'])
  })

  it('provides bottle and lifestyle photos for 7 Artemisiæ without tasting scores', () => {
    const product = getVermouth('7-artemisiae')
    expect(product?.variantImages?.['7-artemisiae-75cl-bottle']?.url).toBe(product?.image)
    expect(product?.extraImages).toHaveLength(2)
    expect(product?.scores).toBeUndefined()
  })

  it.each([undefined, null, '', 'removed-product'])('rejects an unknown handle %s', (handle) => {
    expect(getVermouth(handle)).toBeNull()
  })
})
