import type { Actions, PageServerLoad } from './$types'
import { sdk } from '$lib/medusa'
import { fail, redirect } from '@sveltejs/kit'

const shippingTypeOrder: Record<string, number> = {
  parcel_shop: 1,
}

function sortParcelShopShippingOptionsFirst<T extends { type: { code: string } }>(
  shippingOptions: T[],
) {
  return [...shippingOptions].sort((first, second) => {
    const firstType = first.type.code
    const secondType = second.type.code

    return (shippingTypeOrder[firstType] ?? 999) - (shippingTypeOrder[secondType] ?? 999)
  })
}

function getAddressFields(data: FormData, isBillingAddress: boolean = false) {
  const prefix = isBillingAddress ? 'billing_' : ''
  const first_name = String(data.get(`${prefix}first_name`))
  const last_name = String(data.get(`${prefix}last_name`))
  const address_1 = String(data.get(`${prefix}address`))
  const address_2 = String(data.get(`${prefix}address_2`))
  const company = String(data.get(`${prefix}company`))
  const postal_code = String(data.get(`${prefix}postal_code`))
  const city = String(data.get(`${prefix}city`))
  const phone = String(data.get(`${prefix}phone`))
  const country_code = String(data.get(`${prefix}country`))

  return {
    first_name,
    last_name,
    address_1,
    address_2,
    company,
    postal_code,
    city,
    country_code,
    // province,
    phone,
  }
}

export const load: PageServerLoad = async ({ parent }) => {
  const { cart } = await parent()

  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cart.id,
  })
  const shippingOptions = sortParcelShopShippingOptionsFirst(shipping_options)

  const shippingPrices = Object.fromEntries(
    shippingOptions
      .filter(({ price_type }) => price_type === 'flat')
      .map(({ amount, id }) => [id, amount]),
  )

  const calculatedShippingPrices = await Promise.allSettled(
    shippingOptions
      .filter(({ price_type }) => price_type !== 'flat')
      .map(({ id }) => sdk.store.fulfillment.calculate(id, { cart_id: cart.id, data: {} })),
  )

  calculatedShippingPrices.forEach((result) => {
    if (result.status !== 'fulfilled') return

    const { amount, id } = result.value.shipping_option
    shippingPrices[id] = amount
  })

  return {
    shippingOptions,
    shippingPrices,
  }
}

export const actions = {
  applyDiscountCode: async ({ cookies, request }) => {
    const cart_id = cookies.get('cart_id')
    if (!cart_id) return fail(404, { message: 'Missing cart_id' })

    const data = await request.formData()
    const discountCode = String(data.get('discount_code') ?? '')
      .trim()
      .toUpperCase()

    if (!discountCode) {
      return fail(400, {
        action: 'discountCode',
        discountCode,
        message: 'Indtast en rabatkode.',
      })
    }

    try {
      const { cart } = await sdk.store.cart.retrieve(cart_id)
      const currentPromoCodes =
        cart.promotions?.flatMap(({ code, is_automatic }) =>
          code && !is_automatic ? [code] : [],
        ) ?? []

      await sdk.store.cart.update(cart_id, {
        promo_codes: [...new Set([...currentPromoCodes, discountCode])],
      })

      return {
        action: 'discountCode',
        discountCode,
        message: 'Rabatkoden er tilføjet.',
        success: true,
      }
    } catch (error) {
      console.error('Error applying discount code', error)

      return fail(400, {
        action: 'discountCode',
        discountCode,
        message: 'Rabatkoden kunne ikke anvendes.',
      })
    }
  },
  checkout: async ({ cookies, request }) => {
    const cartId = cookies.get('cart_id')

    if (!cartId) return fail(404, { message: 'Missing cart_id' })

    const data = await request.formData()

    const email = String(data.get('email'))

    const accepts_exclusive_offers = String(data.get('accepts_exclusive_offers')) === 'on'
    const accepts_newsletter = String(data.get('accepts_newsletter')) === 'on'
    const accepts_terms = String(data.get('accepts_terms')) === 'on'
    const useDifferentBillingAddress = String(data.get('different_billing_address')) === 'yes'
    const shipping_method_id = String(data.get('shipping_method_id'))

    await sdk.store.cart.update(cartId, {
      metadata: {
        accepts_exclusive_offers,
        accepts_newsletter,
        accepts_terms,
      },
      email,
      shipping_address: getAddressFields(data),
      billing_address: getAddressFields(data, useDifferentBillingAddress),
    })

    if (!shipping_method_id) return fail(400, { message: 'No shipping method available' })

    await sdk.store.cart.addShippingMethod(cartId, {
      option_id: shipping_method_id,
    })

    redirect(303, '/betaling')
    // return { success: true }
  },
  addOrUpdateItemQuantity: async ({ cookies, request }) => {
    const cart_id = cookies.get('cart_id')
    if (!cart_id) return fail(404, { message: 'Missing cart_id' })

    const data = await request.formData()
    const quantity = Number(data.get('quantity'))
    const variant_id = String(data.get('variant_id'))
    const cart_item_id = String(data.get('cart_item_id'))

    if (cart_item_id) {
      await sdk.store.cart.updateLineItem(cart_id, cart_item_id, {
        quantity,
      })
    } else {
      await sdk.store.cart.createLineItem(cart_id, { variant_id, quantity })
    }

    return { success: true, quantity }
  },
  deleteItem: async ({ cookies, request }) => {
    const cart_id = cookies.get('cart_id')
    if (!cart_id) return fail(404, { message: 'Missing cart_id' })

    const data = await request.formData()
    const cart_item_id = String(data.get('cart_item_id'))

    await sdk.store.cart.deleteLineItem(cart_id, cart_item_id)

    return { success: true }
  },
} satisfies Actions
