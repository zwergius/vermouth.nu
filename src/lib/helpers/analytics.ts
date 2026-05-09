type GaListItem = {
  item_id: string
  item_name: string
  price?: string
  item_brand?: string
  item_category: string
  item_list_name?: string
  item_list_id?: string
  index?: number
  quantity?: string
}

const GA_MISSING = {
  itemId: 'MISSING_ITEM_ID',
  itemName: 'MISSING_ITEM_NAME',
  itemBrand: 'MISSING_ITEM_BRAND',
  itemCategory: 'MISSING_ITEM_CATEGORY',
  itemListName: 'MISSING_ITEM_LIST_NAME',
  itemListId: 'MISSING_ITEM_LIST_ID',
  price: 'MISSING_PRICE',
} as const

const GA_CATEGORY_LABEL_BY_HANDLE = {
  red: 'Red Vermouth',
  white: 'White Vermouth',
  other: 'Orange Vermouth',
} as const

interface WindowWithDataLayer extends Window {
  dataLayer?: Record<string, unknown>[]
}

function withDataLayer(fn: (dataLayer: Record<string, unknown>[]) => void) {
  if (typeof window === 'undefined') return

  const dataLayer = (window as WindowWithDataLayer).dataLayer
  if (!dataLayer) return

  fn(dataLayer)
}

export function initializeAnalytics(_measurementId: string) {
  withDataLayer((dataLayer) => {
    dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  })
}

export function trackViewItemList({ currency, items }: { currency?: string; items: GaListItem[] }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'view_item_list',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items,
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] view_item_list payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackSelectItem({ currency, item }: { currency?: string; item: GaListItem }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'select_item',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items: [item],
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] select_item payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackViewItem({ currency, item }: { currency?: string; item: GaListItem }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'view_item',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items: [item],
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] view_item payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackAddToCart({ currency, item }: { currency?: string; item: GaListItem }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'add_to_cart',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items: [item],
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] add_to_cart payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackRemoveFromCart({ currency, item }: { currency?: string; item: GaListItem }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'remove_from_cart',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items: [item],
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] remove_from_cart payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackViewCart({ currency, items }: { currency?: string; items: GaListItem[] }) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'view_cart',
      ecommerce: {
        ...(currency ? { currency } : {}),
        items,
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] view_cart payload', payload)
    }

    dataLayer.push(payload)
  })
}

export function trackAddShippingInfo({
  currency,
  shippingTier,
  items,
}: {
  currency?: string
  shippingTier: string
  items: GaListItem[]
}) {
  withDataLayer((dataLayer) => {
    const payload = {
      event: 'add_shipping_info',
      ecommerce: {
        ...(currency ? { currency } : {}),
        shipping_tier: shippingTier,
        items,
      },
    }

    if (import.meta.env.DEV) {
      console.info('[analytics] add_shipping_info payload', payload)
    }

    dataLayer.push(payload)
  })
}

export { GA_CATEGORY_LABEL_BY_HANDLE, GA_MISSING }
export type { GaListItem }
