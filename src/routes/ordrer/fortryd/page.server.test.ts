import { describe, expect, it } from 'vitest'
import type { HttpTypes } from '@medusajs/types'
import { _getCancellationEligibility, _getCancellationRequestEmailPayload } from './+page.server'

function getOrder(overrides: Partial<HttpTypes.StoreOrder> = {}): HttpTypes.StoreOrder {
  return {
    currency_code: 'dkk',
    email: 'kunde@example.com',
    fulfillment_status: 'delivered',
    id: 'order_123',
    items: [],
    payment_status: 'captured',
    region_id: null,
    sales_channel_id: null,
    shipping_methods: [],
    status: 'completed',
    summary: {},
    version: 1,
    ...overrides,
  } as HttpTypes.StoreOrder
}

describe('cancellation request email', () => {
  it('builds the resend payload with the expected subject and customer details', () => {
    const payload = _getCancellationRequestEmailPayload(
      {
        customerName: 'Karla Kunde',
        email: 'kunde@example.com',
        message: 'Jeg vil fortryde købet.',
        orderId: 'order_123',
        orderReference: '1001',
        eligibility: {
          deadline: '2026-06-28T23:59:59.999Z',
          deliveredAt: '2026-06-14T09:00:00.000Z',
          orderId: 'order_123',
        },
        submittedAt: '2026-06-28T07:25:00.000Z',
      },
      'Vermouth.nu <noreply@example.com>',
      'info@example.com',
    )

    expect(payload).toEqual({
      from: 'Vermouth.nu <noreply@example.com>',
      reply_to: 'kunde@example.com',
      subject: 'Cancellation Request Order 1001',
      text: [
        'Ny fortrydelsesanmodning',
        '',
        'Modtaget: 2026-06-28T07:25:00.000Z',
        'Navn: Karla Kunde',
        'E-mail: kunde@example.com',
        'Ordrenummer: 1001',
        'Medusa ordre-id: order_123',
        'Leveret: 2026-06-14T09:00:00.000Z',
        'Fortrydelsesfrist: 2026-06-28T23:59:59.999Z',
        '',
        'Besked:',
        'Jeg vil fortryde købet.',
      ].join('\n'),
      to: 'info@example.com',
    })
  })
})

describe('cancellation request eligibility', () => {
  it('accepts an order delivered inside the 14 day cancellation period', () => {
    const eligibility = _getCancellationEligibility(
      getOrder({
        fulfillments: [
          {
            canceled_at: null,
            delivered_at: '2026-06-14T09:00:00.000Z' as unknown as Date,
          } as HttpTypes.StoreOrderFulfillment,
        ],
      }),
      'KUNDE@example.com',
      new Date('2026-06-28T12:00:00.000Z'),
    )

    expect(eligibility).toEqual({
      deadline: '2026-06-28T23:59:59.999Z',
      deliveredAt: '2026-06-14T09:00:00.000Z',
      orderId: 'order_123',
      valid: true,
    })
  })

  it('rejects an order delivered after the cancellation period has passed', () => {
    const eligibility = _getCancellationEligibility(
      getOrder({
        fulfillments: [
          {
            canceled_at: null,
            delivered_at: '2026-06-13T09:00:00.000Z' as unknown as Date,
          } as HttpTypes.StoreOrderFulfillment,
        ],
      }),
      'kunde@example.com',
      new Date('2026-06-28T12:00:00.000Z'),
    )

    expect(eligibility).toEqual({
      deadline: '2026-06-27T23:59:59.999Z',
      deliveredAt: '2026-06-13T09:00:00.000Z',
      orderId: 'order_123',
      reason: 'periodExpired',
      valid: false,
    })
  })

  it('accepts an order without a registered delivery date', () => {
    const eligibility = _getCancellationEligibility(
      getOrder({
        fulfillment_status: 'shipped',
        fulfillments: [
          {
            canceled_at: null,
            delivered_at: null,
          } as HttpTypes.StoreOrderFulfillment,
        ],
      }),
      'kunde@example.com',
      new Date('2026-06-28T12:00:00.000Z'),
    )

    expect(eligibility).toEqual({
      deadline: null,
      deliveredAt: null,
      orderId: 'order_123',
      valid: true,
    })
  })

  it('rejects when the email does not match the order', () => {
    const eligibility = _getCancellationEligibility(
      getOrder(),
      'another@example.com',
      new Date('2026-06-28T12:00:00.000Z'),
    )

    expect(eligibility).toEqual({
      reason: 'orderMismatch',
      valid: false,
    })
  })
})
