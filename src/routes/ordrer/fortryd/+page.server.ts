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

function getValue(data: FormData, name: keyof CancellationRequestValues) {
  return String(data.get(name) ?? '').trim()
}

async function submitCancellationRequest(input: CancellationRequestValues) {
  const cancellationRequest = {
    ...input,
    submittedAt: new Date().toISOString(),
  }

  // TODO VNU-23: Send acknowledgement to the customer and notification to info@vermouth.nu
  // once the production mail provider is selected.
  console.info('Cancellation request submitted', cancellationRequest)

  return cancellationRequest
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

  const cancellationRequest = await submitCancellationRequest(values)

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
