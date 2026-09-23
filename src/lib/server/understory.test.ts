import { expect, it, vi } from 'vitest'
import { getAccessToken } from './understory'

const credentials = { clientId: 'test-client', clientSecret: 'test-secret' }
it('exchanges the credentials for an event-read token', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json({ access_token: 'test-token' }))
  expect(await getAccessToken(credentials, fetcher, new AbortController().signal)).toBe(
    'test-token',
  )
  const [url, options] = fetcher.mock.calls[0]
  expect(url).toBe('https://api.auth.understory.io/oauth2/token')
  expect(Object.fromEntries(options!.body as URLSearchParams)).toMatchObject({
    client_id: 'test-client',
    client_secret: 'test-secret',
    scope: 'openid event.read',
    grant_type: 'client_credentials',
  })
})
it('rejects failed authentication without exposing the response body', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response('sensitive response', { status: 401 }))
  await expect(getAccessToken(credentials, fetcher, new AbortController().signal)).rejects.toThrow(
    'Understory authentication failed',
  )
})
it('rejects an invalid token response', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ access_token: null }))
  await expect(getAccessToken(credentials, fetcher, new AbortController().signal)).rejects.toThrow(
    'Invalid Understory token response',
  )
})
