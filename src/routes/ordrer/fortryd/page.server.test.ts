import { describe, expect, it } from 'vitest'
import { _getCancellationRequestEmailPayload } from './+page.server'

describe('cancellation request email', () => {
  it('builds the resend payload with the expected subject and customer details', () => {
    const payload = _getCancellationRequestEmailPayload(
      {
        customerName: 'Karla Kunde',
        email: 'kunde@example.com',
        message: 'Jeg vil fortryde købet.',
        orderReference: '1001',
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
        '',
        'Besked:',
        'Jeg vil fortryde købet.',
      ].join('\n'),
      to: 'info@example.com',
    })
  })
})
