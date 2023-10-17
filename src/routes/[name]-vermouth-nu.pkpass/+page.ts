import { redirect } from '@sveltejs/kit'

export const ssr = false

/** @type {import('./$types').PageLoad} */
export function load({ params, url }) {
  throw redirect(301, `${url.origin}/cards/${params.name}`)
}
