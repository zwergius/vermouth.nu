type Credentials = { clientId: string; clientSecret: string }

export async function getAccessToken(
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
