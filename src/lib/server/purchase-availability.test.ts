import { describe, expect, it } from 'vitest'
import {
  arePurchasesPaused,
  assertPurchasesAvailable,
  getPurchasePausedActionFailure,
} from './purchase-availability'

describe('purchase availability', () => {
  it.each([undefined, '', 'false', '0', 'yes'])(
    'keeps purchases available when PURCHASES_PAUSED is %s',
    (value) => {
      expect(arePurchasesPaused({ PURCHASES_PAUSED: value })).toBe(false)
      expect(getPurchasePausedActionFailure({ PURCHASES_PAUSED: value })).toBeNull()
      expect(() => assertPurchasesAvailable({ PURCHASES_PAUSED: value })).not.toThrow()
    },
  )

  it.each(['true', 'TRUE', ' true '])('pauses purchases when PURCHASES_PAUSED is %s', (value) => {
    expect(arePurchasesPaused({ PURCHASES_PAUSED: value })).toBe(true)

    const failure = getPurchasePausedActionFailure({ PURCHASES_PAUSED: value })
    expect(failure).toMatchObject({
      data: {
        action: 'purchasePaused',
      },
      status: 503,
    })

    expect(() => assertPurchasesAvailable({ PURCHASES_PAUSED: value })).toThrow()
  })
})
