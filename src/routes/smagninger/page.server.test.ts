import { afterEach, beforeEach, expect, it, vi } from 'vitest'
vi.mock('$env/dynamic/private', () => ({
  env: { UNDERSTORY_CLIENT_ID: 'test-client', UNDERSTORY_CLIENT_SECRET: 'test-secret' },
}))
import { load } from './+page.server'

const session = {
  id: 'november',
  start_time: '2026-11-18T20:00:00',
  end_time: '2026-11-18T22:00:00',
}
const event = { state: 'ACTIVE', visibility: 'PUBLIC', sessions: [session] }
const fetcher = vi.fn<typeof fetch>()
const loadPage = () => load({ fetch: fetcher } as unknown as Parameters<typeof load>[0])
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-23T10:00:00Z'))
  fetcher.mockReset()
  fetcher.mockResolvedValueOnce(Response.json({ access_token: 'test-token' }))
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

it('returns public active sessions directly in Understory order', async () => {
  fetcher.mockResolvedValue(
    Response.json({
      items: [
        ...['CANCELLED', 'COMPLETED', 'INACTIVE', 'UNKNOWN'].map((state) => ({ ...event, state })),
        { ...event, visibility: 'PRIVATE' },
        event,
      ],
    }),
  )
  expect(await loadPage()).toEqual({ tastings: [session] })
  expect(fetcher).toHaveBeenCalledTimes(2)
})
it.each([
  ['2026-11-18T19:00:00Z', '2026-11-18T20:00:00'],
  ['2026-07-18T18:00:00Z', '2026-07-18T20:00:00'],
])('requests up to 100 upcoming events using Danish time (%s)', async (now, from) => {
  vi.setSystemTime(new Date(now))
  fetcher.mockResolvedValue(Response.json({ items: [] }))
  expect(await loadPage()).toEqual({ tastings: [] })
  const [url, options] = fetcher.mock.calls[1]
  expect(Object.fromEntries(new URL(String(url)).searchParams)).toEqual({
    experience_id: '4350f5eb314ef93c9602964ebce84c57',
    from,
    limit: '100',
  })
  expect(options!.headers).toEqual({ Authorization: 'Bearer test-token' })
})
it('keeps the page available when Understory fails without leaking error details', async () => {
  fetcher.mockResolvedValue(new Response('sensitive upstream information', { status: 503 }))
  const log = vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(await loadPage()).toEqual({ tastings: [] })
  expect(log).toHaveBeenCalledWith('Unable to load Understory tasting dates')
})

it('exchanges credentials for an event-read token before fetching events', async () => {
  fetcher.mockResolvedValue(Response.json({ items: [] }))
  await loadPage()
  const [url, options] = fetcher.mock.calls[0]
  expect(url).toBe('https://api.auth.understory.io/oauth2/token')
  expect(Object.fromEntries(options!.body as URLSearchParams)).toMatchObject({
    client_id: 'test-client',
    client_secret: 'test-secret',
    scope: 'openid event.read',
    grant_type: 'client_credentials',
  })
})
it.each([
  new Response('sensitive response', { status: 401 }),
  Response.json({ access_token: null }),
])(
  'handles authentication failures without requesting events or leaking details',
  async (response) => {
    fetcher.mockReset().mockResolvedValue(response)
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await loadPage()).toEqual({ tastings: [] })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledExactlyOnceWith('Unable to load Understory tasting dates')
  },
)
