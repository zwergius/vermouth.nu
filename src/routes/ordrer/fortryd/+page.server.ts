import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { fail } from '@sveltejs/kit'
import type { HttpTypes } from '@medusajs/types'
import type { Actions } from './$types'
import { sdk } from '$lib/medusa'

type CancellationRequestValues = {
  customerName: string
  email: string
  message: string
  orderReference: string
}

type CancellationRequestActionData = {
  action: 'cancellationRequest'
  errors?: Partial<Record<keyof CancellationRequestValues, string>>
  message?: string
  submittedAt?: string
  success?: true
  values: CancellationRequestValues
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cancellationPeriodDays = 14
const fallbackRecipient = 'info@vermouth.nu'

function getValue(data: FormData, name: keyof CancellationRequestValues) {
  return String(data.get(name) ?? '').trim()
}

type CancellationEligibility = {
  deadline: string | null
  deliveredAt: string | null
  orderId: string | null
  status: 'emailMismatch' | 'notChecked' | 'periodExpired' | 'withinPeriod'
}

async function submitCancellationRequest(
  input: CancellationRequestValues,
  eligibility: CancellationEligibility,
) {
  const cancellationRequest = {
    ...input,
    eligibility,
    submittedAt: new Date().toISOString(),
  }

  await sendCancellationRequestEmail(cancellationRequest)

  return cancellationRequest
}

async function sendCancellationRequestEmail(
  input: CancellationRequestValues & {
    eligibility: CancellationEligibility
    submittedAt: string
  },
) {
  const apiKey = env.RESEND_API_KEY
  const sender = env.CANCELLATION_REQUEST_EMAIL_FROM
  const recipient = env.CANCELLATION_REQUEST_EMAIL_TO ?? fallbackRecipient

  if (!apiKey || !sender) {
    if (dev) {
      console.info('Skipping cancellation request email because Resend is not configured.')
      return
    }

    throw new Error('Cancellation request email is not configured.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_getCancellationRequestEmailPayload(input, sender, recipient)),
  })

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '')

    throw new Error(`Resend cancellation request email failed: ${response.status} ${responseBody}`)
  }
}

export function _getCancellationRequestEmailPayload(
  input: CancellationRequestValues & {
    eligibility: CancellationEligibility
    submittedAt: string
  },
  sender: string,
  recipient: string,
) {
  return {
    from: sender,
    reply_to: input.email,
    subject: `Cancellation Request Order ${input.orderReference}`,
    text: getCancellationRequestEmailText(input),
    to: recipient,
  }
}

function getCancellationRequestEmailText(
  input: CancellationRequestValues & {
    eligibility: CancellationEligibility
    submittedAt: string
  },
) {
  return [
    'Ny fortrydelsesanmodning',
    '',
    `Modtaget: ${input.submittedAt}`,
    `Navn: ${input.customerName}`,
    `E-mail: ${input.email}`,
    `Ordrenummer: ${input.orderReference}`,
    `Medusa ordre-id: ${input.eligibility.orderId ?? 'Ikke fundet'}`,
    `Fortrydelsestjek: ${input.eligibility.status}`,
    `Leveret: ${input.eligibility.deliveredAt ?? 'Ikke registreret'}`,
    `Fortrydelsesfrist: ${input.eligibility.deadline ?? 'Ikke fastlagt'}`,
    '',
    'Besked:',
    input.message || '(ingen besked)',
  ].join('\n')
}

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? ''
}

function parseDate(value: Date | string | null | undefined) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function getLatestDeliveryDate(order: HttpTypes.StoreOrder) {
  const deliveredDates = (order.fulfillments ?? [])
    .filter((fulfillment) => !fulfillment.canceled_at)
    .map((fulfillment) => parseDate(fulfillment.delivered_at))
    .filter((deliveredAt): deliveredAt is Date => Boolean(deliveredAt))
    .map((deliveredAt) => deliveredAt.getTime())

  if (!deliveredDates.length) return null

  return new Date(Math.max(...deliveredDates))
}

function getCancellationDeadline(deliveredAt: Date) {
  const deadline = new Date(deliveredAt)
  deadline.setUTCDate(deadline.getUTCDate() + cancellationPeriodDays)
  deadline.setUTCHours(23, 59, 59, 999)
  return deadline
}

export function _getCancellationEligibility(
  order: HttpTypes.StoreOrder,
  email: string,
  now = new Date(),
) {
  if (normalizeEmail(order.email) !== normalizeEmail(email)) {
    return {
      deadline: null,
      deliveredAt: null,
      orderId: order.id,
      status: 'emailMismatch',
      valid: false,
    } as const
  }

  const deliveredAt = getLatestDeliveryDate(order)

  if (!deliveredAt) {
    return {
      deadline: null,
      deliveredAt: null,
      orderId: order.id,
      status: 'withinPeriod',
      valid: true,
    } as const
  }

  const deadline = getCancellationDeadline(deliveredAt)
  const isWithinCancellationPeriod = now.getTime() <= deadline.getTime()

  if (!isWithinCancellationPeriod) {
    return {
      deadline: deadline.toISOString(),
      deliveredAt: deliveredAt.toISOString(),
      orderId: order.id,
      status: 'periodExpired',
      valid: false,
    } as const
  }

  return {
    deadline: deadline.toISOString(),
    deliveredAt: deliveredAt.toISOString(),
    orderId: order.id,
    status: 'withinPeriod',
    valid: true,
  } as const
}

export function _getOrderLookupReferences(orderReference: string) {
  const normalizedReference = orderReference.trim()

  if (!normalizedReference || normalizedReference.startsWith('order_')) {
    return [normalizedReference]
  }

  return [normalizedReference, `order_${normalizedReference}`]
}

async function getOrderCancellationEligibility(values: CancellationRequestValues) {
  for (const orderReference of _getOrderLookupReferences(values.orderReference)) {
    try {
      const { order } = await sdk.store.order.retrieve(orderReference, {
        fields: 'id,email,display_id,*fulfillments',
      })

      return _getCancellationEligibility(order, values.email)
    } catch {
      continue
    }
  }

  console.error('Error retrieving order for cancellation request', values.orderReference)

  return {
    deadline: null,
    deliveredAt: null,
    orderId: null,
    status: 'notChecked',
    valid: true,
  } as const
}

async function handleCancellationRequestForm(data: FormData) {
  const values = {
    customerName: getValue(data, 'customerName'),
    email: getValue(data, 'email'),
    message: getValue(data, 'message'),
    orderReference: getValue(data, 'orderReference'),
  }
  const errors: CancellationRequestActionData['errors'] = {}

  if (!values.customerName) errors.customerName = 'Indtast dit navn.'
  if (!values.orderReference) errors.orderReference = 'Indtast ordrenummer eller aftaledetaljer.'
  if (!values.email) {
    errors.email = 'Indtast din e-mailadresse.'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Indtast en gyldig e-mailadresse.'
  }

  if (Object.keys(errors).length) {
    return fail(400, {
      action: 'cancellationRequest',
      errors,
      message: 'Udfyld de markerede felter.',
      values,
    } satisfies CancellationRequestActionData)
  }

  const eligibility = await getOrderCancellationEligibility(values)

  if (!eligibility.valid && eligibility.status === 'emailMismatch') {
    return fail(400, {
      action: 'cancellationRequest',
      message: 'E-mailadressen matcher ikke ordren. Tjek oplysningerne og prøv igen.',
      values,
    } satisfies CancellationRequestActionData)
  }

  if (!eligibility.valid && eligibility.status === 'periodExpired') {
    return fail(400, {
      action: 'cancellationRequest',
      message: 'Fortrydelsesfristen på 14 dage er udløbet for denne ordre.',
      values,
    } satisfies CancellationRequestActionData)
  }

  let cancellationRequest: Awaited<ReturnType<typeof submitCancellationRequest>>

  try {
    cancellationRequest = await submitCancellationRequest(values, eligibility)
  } catch (error) {
    console.error('Error submitting cancellation request', error)

    return fail(502, {
      action: 'cancellationRequest',
      message: `Vi kunne ikke sende din fortrydelse. Skriv til ${fallbackRecipient}, så hjælper vi dig.`,
      values,
    } satisfies CancellationRequestActionData)
  }

  return {
    action: 'cancellationRequest',
    message: 'Din fortrydelse er modtaget.',
    submittedAt: cancellationRequest.submittedAt,
    success: true,
    values,
  } satisfies CancellationRequestActionData
}

export const actions: Actions = {
  submit: async ({ request }) => {
    return handleCancellationRequestForm(await request.formData())
  },
}
