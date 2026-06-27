import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = ({ params }) => {
  redirect(308, `/ordrer/${params.id}`)
}
