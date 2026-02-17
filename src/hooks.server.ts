import { PUBLIC_MEDUSA_PUBLISHABLE_KEY, PUBLIC_VITE_BACKEND_URL } from '$env/static/public'
import type { Handle, HandleFetch } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.request.headers.get('accept-language')?.split(',')[0]
  if (lang) {
    event.locals.locale = lang
  }
  return resolve(event)
}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  console.log(
    'event.url.origin: ',
    event.url.origin,
    ' request.url: ',
    request.url,
    'PUBLIC_VITE_BACKEND_URL: ',
    PUBLIC_VITE_BACKEND_URL,
  )
  if (request.url.includes('/store/')) {
    console.log('replacedUrl: ', request.url.replace(event.url.origin, PUBLIC_VITE_BACKEND_URL))
    request = new Request(request.url.replace(event.url.origin, PUBLIC_VITE_BACKEND_URL), request)
    request.headers.set('x-publishable-api-key', PUBLIC_MEDUSA_PUBLISHABLE_KEY)
  }

  console.log(JSON.stringify(request))
  return fetch(request)
}
