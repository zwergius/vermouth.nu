<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'
  import type { HttpTypes } from '@medusajs/types'
  import type { PageProps } from './$types'
  import { Form, Input } from '$lib/components/form-controls'
  import { vermouths, type Handle } from '$lib/data/products'
  import { thumbnailSrcSet } from '$lib/helpers/images'
  import type { ProductReviewSubmissionResult } from '../../../api/products/[id]/reviews/+server'

  const { data, form }: PageProps = $props()

  type ReviewFormValues = {
    content?: string
    rating?: string
    reviewer_email?: string
    reviewer_name?: string
    title?: string
  }

  type ReviewFormResult = ProductReviewSubmissionResult & {
    values?: ReviewFormValues
  }

  type ReviewableOrderItem = {
    lineItemIds: string[]
    image: string | null
    productHandle: string | null
    productId: string
    quantity: number
    title: string
    variantTitle: string | null
  }

  const ratingOptions = [1, 2, 3, 4, 5]

  let isReviewSubmitting = $state(false)
  let submittedProductIds = $state<string[]>([])

  const reviewerName = $derived(getReviewerName(data.order))
  const reviewableItems = $derived(getReviewableItems(data.order))

  function getReviewerName(order: HttpTypes.StoreOrder) {
    const address = order.shipping_address ?? order.billing_address
    return [address?.first_name, address?.last_name].filter(Boolean).join(' ')
  }

  function isProductHandle(handle: string | null | undefined): handle is Handle {
    return !!handle && handle in vermouths
  }

  function getReviewableItems(order: HttpTypes.StoreOrder): ReviewableOrderItem[] {
    const reviewableItems: ReviewableOrderItem[] = []

    for (const item of order.items ?? []) {
      if (!item.product_id) continue

      const existingItem = reviewableItems.find(
        (reviewableItem) => reviewableItem.productId === item.product_id,
      )

      if (existingItem) {
        existingItem.lineItemIds.push(item.id)
        existingItem.quantity += item.quantity
        continue
      }

      reviewableItems.push({
        image: isProductHandle(item.product_handle) ? vermouths[item.product_handle].image : null,
        lineItemIds: [item.id],
        productHandle: item.product_handle,
        productId: item.product_id,
        quantity: item.quantity,
        title: item.product_title ?? item.title,
        variantTitle: item.variant_title,
      })
    }

    return reviewableItems
  }

  function getProductFormResult(productId: string) {
    return form?.productId === productId ? (form as ReviewFormResult) : null
  }

  function getFormValues(productId: string) {
    return getProductFormResult(productId)?.values ?? {}
  }

  function isSubmitted(productId: string) {
    const result = getProductFormResult(productId)
    return (
      submittedProductIds.includes(productId) || Boolean(result?.success || result?.alreadyReviewed)
    )
  }

  function getProductMessage(productId: string) {
    return getProductFormResult(productId)?.message
  }

  function rememberSubmittedProduct(result: ActionResult) {
    if (result.type !== 'success' || !result.data) return

    const { productId } = result.data as ProductReviewSubmissionResult
    if (!productId || submittedProductIds.includes(productId)) return

    submittedProductIds = [...submittedProductIds, productId]
  }
</script>

<svelte:head>
  <title>Anmeld ordre #{data.order.display_id} | Vermouth.nu</title>
</svelte:head>

<section class="content border-b border-black">
  <p class="text-xs font-bold uppercase">Ordre #{data.order.display_id}</p>
  <h1>Anmeld dine produkter</h1>
  <p>
    Fortæl os, hvad du synes om de flasker du har smagt. Anmeldelser bliver synlige, når de er
    godkendt.
  </p>
</section>

<section class="border-b border-black px-4 py-8 lg:px-20 lg:py-16">
  <div class="mx-auto max-w-5xl">
    {#each reviewableItems as item (item.productId)}
      {@const values = getFormValues(item.productId)}
      {@const message = getProductMessage(item.productId)}
      {@const submitted = isSubmitted(item.productId)}
      <article class="border-b border-black py-8 first:pt-0 last:border-b-0">
        <div class="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-12">
          <div>
            {#if item.image}
              <img
                alt={item.title}
                class="aspect-square w-full max-w-48 object-cover"
                height="192"
                loading="lazy"
                sizes="(max-width: 1024px) 12rem, 12rem"
                src="{item.image}/w=192,h=192,fit=cover"
                srcset={thumbnailSrcSet(item.image)}
                width="192"
              />
            {/if}
            <div class="mt-4 text-sm">
              <h2 class="font-bold">{item.title}</h2>
              {#if item.variantTitle}
                <p>{item.variantTitle}</p>
              {/if}
              <p>{item.quantity} stk.</p>
            </div>
          </div>

          <div>
            {#if submitted}
              <div
                class="border border-dark-blue bg-white/40 p-6 text-sm"
                role="status"
                aria-live="polite"
              >
                <p class="font-bold">{message ?? 'Tak for din anmeldelse.'}</p>
                <p class="mt-2">
                  Vi gennemgår den, før den bliver vist sammen med de andre anmeldelser.
                </p>
              </div>
            {:else}
              <Form
                action="?/submitReview"
                bind:isSubmitting={isReviewSubmitting}
                onResult={rememberSubmittedProduct}
                reset
              >
                <input name="product_id" type="hidden" value={item.productId} />
                <input name="line_item_id" type="hidden" value={item.lineItemIds[0]} />

                <fieldset class="mb-6">
                  <legend class="mb-3 text-sm font-bold">Din vurdering</legend>
                  <div class="grid grid-cols-5 border border-dark-blue">
                    {#each ratingOptions as rating (rating)}
                      <label
                        class="flex min-h-14 cursor-pointer items-center justify-center border-r border-dark-blue bg-white/40 text-sm font-bold last:border-r-0 has-[:checked]:bg-brand-blue has-[:checked]:text-white"
                      >
                        <input
                          checked={values.rating === String(rating)}
                          class="sr-only"
                          name="rating"
                          required
                          type="radio"
                          value={rating}
                        />
                        <span>{rating}</span>
                        <span class="sr-only"> ud af 5 stjerner</span>
                      </label>
                    {/each}
                  </div>
                </fieldset>

                <div class="mb-4 grid gap-4 md:grid-cols-2">
                  <Input
                    autocomplete="name"
                    id="reviewer-name-{item.productId}"
                    label="Navn"
                    maxlength={120}
                    name="reviewer_name"
                    required
                    value={values.reviewer_name ?? reviewerName}
                  />
                  <Input
                    autocomplete="email"
                    id="reviewer-email-{item.productId}"
                    label="Email"
                    name="reviewer_email"
                    required
                    type="email"
                    value={values.reviewer_email ?? data.order.email}
                  />
                </div>

                <div class="mb-4">
                  <Input
                    id="review-title-{item.productId}"
                    label="Overskrift (valgfrit)"
                    maxlength={120}
                    name="title"
                    value={values.title}
                  />
                </div>

                <div class="relative mb-6 border border-dark-blue bg-white/40">
                  <textarea
                    class="min-h-40 w-full bg-transparent p-6 text-sm focus:bg-white"
                    maxlength="5000"
                    name="content"
                    placeholder="Din anmeldelse">{values.content ?? ''}</textarea
                  >
                </div>

                {#if message}
                  <p class="mb-4 text-xs font-bold text-brand-red" role="alert">{message}</p>
                {/if}

                <button
                  class="btn justify-center transition-colors disabled:cursor-not-allowed disabled:bg-brand-blue/60"
                  disabled={isReviewSubmitting}
                  type="submit"
                >
                  {isReviewSubmitting ? 'SENDER...' : 'SEND ANMELDELSE'}
                </button>
              </Form>
            {/if}
          </div>
        </div>
      </article>
    {:else}
      <div class="mx-auto max-w-xl text-center">
        <h2 class="mb-4 text-base font-bold">Ingen produkter at anmelde</h2>
        <p class="text-sm">Vi kunne ikke finde produkter på ordren, der kan anmeldes.</p>
      </div>
    {/each}
  </div>
</section>
