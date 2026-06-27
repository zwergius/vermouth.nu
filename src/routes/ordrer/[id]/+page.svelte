<script lang="ts">
  import { onMount } from 'svelte'
  import { vermouths, type Handle } from '$lib/data/products'
  import {
    GA_CATEGORY_LABEL_BY_HANDLE,
    GA_MISSING,
    trackAddPaymentInfo,
    trackPurchase,
    type GaListItem,
    type GaPurchaseAddress,
  } from '$lib/helpers/analytics'
  import { resolve } from '$app/paths'
  import CancelRequestForm from '$lib/components/cancel-request-form.svelte'
  import ModalDialog from '$lib/components/modal-dialog.svelte'
  import type { PageData } from './$types'
  import { formatPrice } from '$lib/helpers/numbers'

  const { data }: { data: PageData } = $props()
  const { locale, order } = $derived(data)
  let isCancellationRequestOpen = $state(false)
  type CategoryHandle = keyof typeof GA_CATEGORY_LABEL_BY_HANDLE

  type AddPaymentInfoMetadata = {
    paymentMethodType?: string
    paymentMethodSubType?: string
  }

  type PaymentCollectionWithMetadata = {
    metadata?: {
      add_payment_info?: AddPaymentInfoMetadata
    } | null
  }

  type OrderWithPaymentCollections = {
    payment_collections?: PaymentCollectionWithMetadata[] | PaymentCollectionWithMetadata
  }

  function getCategoryHandleByProductHandle(productHandle?: string | null): CategoryHandle | null {
    if (!productHandle) return null

    for (const categoryHandle of ['red', 'white', 'other', 'packs'] as const) {
      if (data.categories[categoryHandle].some((product) => product.handle === productHandle)) {
        return categoryHandle
      }
    }

    return null
  }

  function toGaItems() {
    return order.items!.map((item): GaListItem => {
      const handle = item.product_handle as Handle | null
      const staticData = handle && handle in vermouths ? vermouths[handle] : null
      const categoryHandle = getCategoryHandleByProductHandle(handle)

      return {
        item_id: item.product_id || item.id || GA_MISSING.itemId,
        item_name: item.product_title || item.title || GA_MISSING.itemName,
        price: String(item.unit_price),
        item_brand: staticData?.brand || GA_MISSING.itemBrand,
        item_category: categoryHandle
          ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle]
          : GA_MISSING.itemCategory,
        quantity: String(item.quantity),
      }
    })
  }

  function getCouponCode() {
    const itemCode = order
      .items!.flatMap((item) => item.adjustments ?? [])
      .map((adjustment) => adjustment.code)
      .find((code): code is string => !!code)

    if (itemCode) return itemCode

    const shippingCode = (order.shipping_methods ?? [])
      .flatMap((method) => method.adjustments ?? [])
      .map((adjustment) => adjustment.code)
      .find((code): code is string => !!code)

    return shippingCode ?? ''
  }

  function getPaymentType() {
    const { payment_collections: paymentCollections } =
      order as unknown as OrderWithPaymentCollections
    const collections = Array.isArray(paymentCollections)
      ? paymentCollections
      : paymentCollections
        ? [paymentCollections]
        : []
    const addPaymentInfo = collections
      .map((collection) => collection.metadata?.add_payment_info)
      .find((metadata): metadata is AddPaymentInfoMetadata => !!metadata?.paymentMethodType)

    if (!addPaymentInfo) return ''
    if (!addPaymentInfo.paymentMethodSubType) return addPaymentInfo.paymentMethodType

    return `${addPaymentInfo.paymentMethodType}-${addPaymentInfo.paymentMethodSubType}`
  }

  function getTransactionId() {
    const captureTransaction = (order.transactions ?? []).find(
      (transaction) => transaction.reference === 'capture',
    )

    return captureTransaction?.reference_id || order.id
  }

  function getPurchaseAddress(): GaPurchaseAddress {
    const shippingAddress = order.shipping_address

    return {
      first_name: shippingAddress?.first_name || '',
      last_name: shippingAddress?.last_name || '',
      email: order.email || '',
      phone_number: shippingAddress?.phone || '',
      street: shippingAddress?.address_1 || '',
      city: shippingAddress?.city || '',
      region: shippingAddress?.province || '',
      country: shippingAddress?.country_code || '',
      postal_code: shippingAddress?.postal_code || '',
    }
  }

  function handleCancellationRequestOpen(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    e.preventDefault()
    isCancellationRequestOpen = true
  }

  onMount(() => {
    const paymentType = getPaymentType()
    const items = toGaItems()

    if (paymentType) {
      trackAddPaymentInfo({
        currency: order.currency_code.toUpperCase(),
        paymentType,
        items,
      })
    }

    trackPurchase({
      address: getPurchaseAddress(),
      currency: order.currency_code.toUpperCase(),
      coupon: getCouponCode(),
      items,
      shipping: String(order.shipping_total),
      tax: String(order.tax_total),
      transactionId: getTransactionId(),
      value: String(order.total),
    })
  })
</script>

<section class="content">
  <h1>TAK for din handel!</h1>

  <p>Ordrenummer #{order.display_id}</p>

  <p class="text-base">Du modtager en email med faktura og leveringsdetaljer.</p>
  <div class="mb-6 md:mb-8">
    <a
      class="btn mx-auto w-fit justify-center text-sm"
      href={resolve('/ordrer/fortryd')}
      onclick={handleCancellationRequestOpen}>Fortryd køb her</a
    >
  </div>

  <h2>Ordreoversigt</h2>

  <div class="lg:max-w-[1068px] mb-6 mx-auto text-sm lg:text-base">
    {#each order.items as item (item.id)}
      <div class="flex justify-between items-center py-2 border-b border-black">
        <span>{item.product_title} x {item.quantity}</span>
        <span>{formatPrice(item.unit_price * item.quantity, order.currency_code, locale)}</span>
      </div>
    {/each}
    <div class="flex justify-between items-center py-2">
      <span>Levering</span>
      <span
        >{order.shipping_total > 0
          ? formatPrice(order.shipping_total, order.currency_code, locale)
          : 'Gratis'}</span
      >
    </div>
    <div class="flex justify-between items-center mb-3 font-bold">
      <span>Total</span>
      <span>{formatPrice(order.total, order.currency_code, locale)}</span>
    </div>
  </div>

  <p>På gensyn snart :)</p>
</section>

<ModalDialog
  bind:open={isCancellationRequestOpen}
  closeLabel="Luk fortrydelsesformular"
  title="Fortryd køb"
>
  {#snippet children(close)}
    <CancelRequestForm
      {locale}
      onClose={close}
      prefill={{
        customerName: `${order.shipping_address?.first_name ?? ''} ${
          order.shipping_address?.last_name ?? ''
        }`.trim(),
        email: order.email ?? '',
        orderReference: String(order.display_id ?? order.id ?? ''),
      }}
      showDialogActions
    />
  {/snippet}
</ModalDialog>
