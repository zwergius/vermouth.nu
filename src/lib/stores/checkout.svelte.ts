import { sdk } from '$lib/medusa'
import type { HttpTypes, StoreAddAddress } from '@medusajs/types'

export class Checkout {
  cart = $state<HttpTypes.StoreCart>()
  cartId = $derived(this.cart?.id)

  constructor(cart: HttpTypes.StoreCart) {
    this.cart = cart
  }

  addToCart = async (variant_id: string, quantity: number) => {
    try {
      if (!this.cartId) throw Error('No cartId!!')

      const { cart } = await sdk.store.cart.createLineItem(this.cartId, { variant_id, quantity })
      this.cart = cart
    } catch (e) {
      console.error(`addToCart failed with error: ${e}`)
    }
  }

  updateCartAddress = async (address: StoreAddAddress, billingAddress?: StoreAddAddress) => {
    try {
      if (!this.cartId) throw Error('No cartId!!')

      const { cart } = await sdk.store.cart.update(this.cartId, {
        shipping_address: address,
        billing_address: billingAddress ?? address,
      })
      this.cart = cart
    } catch (e) {
      console.error(`updateCart failed with error: ${e}`)
    }
  }

  updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      if (!this.cartId) throw Error('No cartId!!')

      const { cart } = await sdk.store.cart.updateLineItem(this.cartId, itemId, {
        quantity,
      })
      this.cart = cart
    } catch (e) {
      console.error(`updateItemQuantity failed with error: ${e}`)
    }
  }

  removeItem = async (itemId: string) => {
    try {
      if (!this.cartId) throw Error('No cartId!!')

      const { parent: cart } = await sdk.store.cart.deleteLineItem(this.cartId, itemId)
      this.cart = cart
    } catch (e) {
      console.error(`deleteItem failed with error: ${e}`)
    }
  }

  setShippingMethod = async (shippingOptionId: string) => {
    try {
      if (!this.cartId) throw Error('No cartId!!')

      const { cart } = await sdk.store.cart.addShippingMethod(this.cartId, {
        option_id: shippingOptionId,
        data: {
          // TODO add any data necessary for
          // fulfillment provider
        },
      })

      this.cart = cart
    } catch (e) {
      console.error(`setShippingMethod failed with error: ${e}`)
    }
  }
}
