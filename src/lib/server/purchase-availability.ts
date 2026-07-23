import { env } from '$env/dynamic/private'
import { error, fail } from '@sveltejs/kit'
import { PURCHASES_PAUSED_MESSAGE } from '$lib/purchase-availability'

type PrivateEnvironment = Record<string, string | undefined>

export function arePurchasesPaused(environment: PrivateEnvironment = env) {
  return environment.PURCHASES_PAUSED?.trim().toLowerCase() === 'true'
}

export function getPurchasePausedActionFailure(environment: PrivateEnvironment = env) {
  if (!arePurchasesPaused(environment)) return null

  return fail(503, {
    action: 'purchasePaused' as const,
    message: PURCHASES_PAUSED_MESSAGE,
  })
}

export function assertPurchasesAvailable(environment: PrivateEnvironment = env) {
  if (arePurchasesPaused(environment)) {
    error(503, PURCHASES_PAUSED_MESSAGE)
  }
}
