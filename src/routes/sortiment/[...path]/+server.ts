import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url }) => {
  redirect(308, `${url.pathname.replace('/sortiment', '/shop')}${url.search}`)
}
