import { sdk } from '$lib/medusa'
import type { HttpTypes, StoreRegion } from '@medusajs/types'
import { browser } from '$app/environment'

export class Checkout {
  private localStorageKey = 'cart_id'
  cart = $state<HttpTypes.StoreCart>()
  region = $state<StoreRegion>()
  cartId = $derived(this.cart?.id)

  constructor(region: StoreRegion) {
    this.region = region

    if (browser) {
      this.createOrRetrieveCart()
    }
  }

  private createOrRetrieveCart = async () => {
    const cartId = localStorage.getItem(this.localStorageKey)

    if (cartId) {
      const { cart } = await sdk.store.cart.retrieve(cartId)
      this.cart = cart
    } else {
      const { cart } = await sdk.store.cart.create({
        region_id: this.region?.id,
      })
      this.cart = cart
      localStorage.setItem(this.localStorageKey, cart.id)
    }
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
}
