import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { sdk } from '$lib/medusa'
import { getReviewerName, getReviewableItems } from './reviewable-items'

export const load: PageLoad = async ({ parent, params }) => {
  try {
    const [{ order }, { locale }] = await Promise.all([
      sdk.store.order.retrieve(params.id),
      parent(),
    ])
    const reviewableItems = getReviewableItems(order)

    return {
      locale,
      order: {
        display_id: order.display_id,
        email: order.email,
        id: order.id,
      },
      reviewerName: getReviewerName(order),
      reviewableItems,
    }
  } catch (orderError) {
    console.error('order.retrieve failed with error: ', orderError)
    error(404, 'Ordren blev ikke fundet.')
  }
}
