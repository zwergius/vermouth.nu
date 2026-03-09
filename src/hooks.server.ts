import { PUBLIC_MEDUSA_PUBLISHABLE_KEY, PUBLIC_VITE_BACKEND_URL } from '$env/static/public'
import type { Handle, HandleFetch } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  let locale = 'en'
  const lang = event.request.headers.get('accept-language')?.split(',')[0]
  if (lang) {
    ;[locale] = lang.split(';')
  }
  event.locals.locale = locale
  return resolve(event)
}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  if (request.url.includes('/store/')) {
    request = new Request(request.url.replace(event.url.origin, PUBLIC_VITE_BACKEND_URL), request)
    request.headers.set('x-publishable-api-key', PUBLIC_MEDUSA_PUBLISHABLE_KEY)
  }
  return fetch(request)
}
