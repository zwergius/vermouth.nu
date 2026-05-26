import type { PageServerLoad } from './$types'
import { EPAY_API_KEY } from '$env/static/private'
import { PUBLIC_VITE_BACKEND_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

interface EpayPayload {
  amount: number // cents
  currency: string // DKK uppercase
  pointOfSaleId: string // uuid
  scaMode?: 'FORCE' | 'NORMAL' | 'SKIP'
  timeout?: number // minutes
  instantCapture?: 'OFF' | 'NO_VOID' | 'VOID'
  processor?: string[]
  exemptions?: string[]
  maxAttempts?: number
  notificationUrl?: string
  successUrl: string
  failureUrl: string
  reference?: string // cartId
}

export const load: PageServerLoad = async ({ fetch, parent, url }) => {
  const { cart } = await parent()

  // Create headers for the payment request
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${EPAY_API_KEY}`)

  // Define the payment payload data
  const paymentData: EpayPayload = {
    amount: cart.total * 100, // minor amount
    currency: cart.currency_code.toUpperCase(),
    failureUrl: `${url.origin}/betaling/fejl`,
    notificationUrl: `${PUBLIC_VITE_BACKEND_URL}/webhooks/epay`,
    pointOfSaleId: '019c24fb-6160-7f38-ba3f-17cf67a0fd72',
    reference: cart.id.replace('cart_', ''),
    successUrl: `${url.origin}/betaling/success`,
  }

  // Setup the fetch options
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(paymentData),
    // redirect: 'follow',
  }

  const res = await fetch('https://payments.epay.eu/public/api/v1/cit', requestOptions)
  if (!res.ok) {
    const error = await res.json()
    console.error(error.errors)
    throw Error()
  }

  const { paymentWindowUrl } = await res.json()

  redirect(303, paymentWindowUrl)
}
