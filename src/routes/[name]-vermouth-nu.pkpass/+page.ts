import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export function load({ params, url }) {
  const NameParam = params.name
  throw redirect(301, `${url.origin}/cards/${NameParam}`)

  if (NameParam) {
    throw error(404)
  }
}
