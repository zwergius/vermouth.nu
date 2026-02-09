import Medusa from '@medusajs/js-sdk'
import { env } from '$env/dynamic/public'

export const sdk = new Medusa({
  baseUrl: env.PUBLIC_VITE_BACKEND_URL || '/',
  debug: true, // import.meta.env.DEV,
  publishableKey: env.PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: 'session',
  },
})
