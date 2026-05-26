// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      locale: string
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module '$env/static/public' {
  export const PUBLIC_COOKIE_YES_ID: string
  export const PUBLIC_GA_MEASUREMENT_ID: string
  export const PUBLIC_MEDUSA_PUBLISHABLE_KEY: string
  export const PUBLIC_POINT_OF_SALE_ID: string
  export const PUBLIC_VITE_BACKEND_URL: string
}

declare module '$env/static/private' {
  export const EPAY_API_KEY: string
}

export {}
