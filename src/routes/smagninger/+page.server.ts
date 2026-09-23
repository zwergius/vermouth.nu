import { env } from '$env/dynamic/private'
import type { PageServerLoad } from './$types'

const EXPERIENCE_ID = '4350f5eb314ef93c9602964ebce84c57'

interface UnderstoryEvent {
  state: string
  visibility: string
  sessions: { id: string; start_time: string; end_time: string }[]
}

type Credentials = { clientId: string; clientSecret: string }

async function getAccessToken(
  credentials: Credentials,
  fetcher: typeof fetch,
  signal: AbortSignal,
) {
  const auth = await fetcher('https://api.auth.understory.io/oauth2/token', {
    method: 'POST',
    signal,
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      audience: 'https://api.understory.io',
      scope: 'openid event.read',
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
    }),
  })
  if (!auth.ok) throw new Error('Understory authentication failed')
  const { access_token: token } = await auth.json()
  if (typeof token !== 'string' || !token) throw new Error('Invalid Understory token response')

  return token
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    if (!env.UNDERSTORY_CLIENT_ID || !env.UNDERSTORY_CLIENT_SECRET) {
      throw new Error('Understory credentials are not configured')
    }
    const signal = AbortSignal.timeout(5000)
    const token = await getAccessToken(
      {
        clientId: env.UNDERSTORY_CLIENT_ID,
        clientSecret: env.UNDERSTORY_CLIENT_SECRET,
      },
      fetch,
      signal,
    )
    // Understory expects a local ISO timestamp without an offset; sv-SE supplies that ordering.
    const from = new Date()
      .toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' })
      .replace(' ', 'T')
    const query = new URLSearchParams({ experience_id: EXPERIENCE_ID, from, limit: '100' })
    const response = await fetch(`https://api.understory.io/v1/events?${query}`, {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Understory events request failed')
    const { items }: { items: UnderstoryEvent[] } = await response.json()
    return {
      tastings: items
        .filter((event) => event.state === 'ACTIVE' && event.visibility === 'PUBLIC')
        .flatMap((event) => event.sessions),
    }
  } catch {
    console.error('Unable to load Understory tasting dates')
    return { tastings: [] }
  }
}
