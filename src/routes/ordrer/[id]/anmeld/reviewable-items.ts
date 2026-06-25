import type { HttpTypes } from '@medusajs/types'

export type ReviewableOrderItem = {
  lineItemIds: string[]
  productHandle: string | null
  productId: string
  quantity: number
  thumbnail: string | null
  title: string
  variantTitle: string | null
}

export function getReviewerName(order: HttpTypes.StoreOrder) {
  const address = order.shipping_address ?? order.billing_address
  return [address?.first_name, address?.last_name].filter(Boolean).join(' ')
}

export function getReviewableItems(order: HttpTypes.StoreOrder): ReviewableOrderItem[] {
  const itemsByProductId = new Map<string, ReviewableOrderItem>()

  for (const item of order.items ?? []) {
    if (!item.product_id) continue

    const existingItem = itemsByProductId.get(item.product_id)

    if (existingItem) {
      existingItem.lineItemIds.push(item.id)
      existingItem.quantity += item.quantity
      continue
    }

    itemsByProductId.set(item.product_id, {
      lineItemIds: [item.id],
      productHandle: item.product_handle,
      productId: item.product_id,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
      title: item.product_title ?? item.title,
      variantTitle: item.variant_title,
    })
  }

  return Array.from(itemsByProductId.values())
}
