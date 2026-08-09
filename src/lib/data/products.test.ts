import { describe, expect, it } from 'vitest'
import { getVermouth, vermouths } from './products'

describe('static product data', () => {
  it('resolves a known product handle', () => {
    expect(getVermouth('sardino-rojo')).toBe(vermouths['sardino-rojo'])
  })

  it.each([undefined, null, '', 'removed-product'])('rejects an unknown handle %s', (handle) => {
    expect(getVermouth(handle)).toBeNull()
  })
})
