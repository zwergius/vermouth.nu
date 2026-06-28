import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

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
const fallbackRecipient = 'info@vermouth.nu'

function getValue(data: FormData, name: keyof CancellationRequestValues) {
  return String(data.get(name) ?? '').trim()
}

async function submitCancellationRequest(input: CancellationRequestValues) {
  const cancellationRequest = {
    ...input,
    submittedAt: new Date().toISOString(),
  }

  await sendCancellationRequestEmail(cancellationRequest)

  return cancellationRequest
}

async function sendCancellationRequestEmail(
  input: CancellationRequestValues & { submittedAt: string },
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
  input: CancellationRequestValues & { submittedAt: string },
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
  input: CancellationRequestValues & { submittedAt: string },
) {
  return [
    'Ny fortrydelsesanmodning',
    '',
    `Modtaget: ${input.submittedAt}`,
    `Navn: ${input.customerName}`,
    `E-mail: ${input.email}`,
    `Ordrenummer: ${input.orderReference}`,
    '',
    'Besked:',
    input.message || '(ingen besked)',
  ].join('\n')
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

  let cancellationRequest: Awaited<ReturnType<typeof submitCancellationRequest>>

  try {
    cancellationRequest = await submitCancellationRequest(values)
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
