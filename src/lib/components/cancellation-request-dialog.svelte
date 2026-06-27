<script lang="ts">
  import { resolve } from '$app/paths'
  import type { ActionResult } from '@sveltejs/kit'
  import { Form, Input, Textarea } from '$lib/components/form-controls'
  import ModalDialog from '$lib/components/modal-dialog.svelte'

  type Mode = 'dialog' | 'page'
  type CancellationRequestValues = {
    customerName: string
    email: string
    message: string
    orderReference: string
  }
  type CancellationRequestActionData = {
    action: 'cancellationRequest'
    errors?: Partial<Record<keyof CancellationRequestValues, string>>
    message?: string
    submittedAt?: string
    success?: true
    values: CancellationRequestValues
  }
  type Prefill = Partial<CancellationRequestValues>

  interface Props {
    actionData?: CancellationRequestActionData | null
    mode?: Mode
    prefill?: Prefill
    triggerClass?: string
    triggerLabel?: string
  }

  const {
    actionData = null,
    mode = 'dialog',
    prefill = {},
    triggerClass = 'hover:font-bold',
    triggerLabel = 'Fortryd køb her',
  }: Props = $props()

  const dialogTitleId = $props.id()

  let isOpen = $state(false)
  let isSubmitting = $state(false)
  let localResult = $state<CancellationRequestActionData | null>(null)

  const isDialog = $derived(mode === 'dialog')
  const result = $derived(localResult ?? actionData)
  const formAction = $derived(getFormAction())
  const submittedAtLabel = $derived(getSubmittedAtLabel(result?.submittedAt))
  const values = $derived(result?.values ?? prefill)
  const errors = $derived(result?.errors ?? {})

  function getCancellationRequestPath() {
    return resolve('/ordrer/fortryd')
  }

  function getFormAction() {
    const search = getFallbackSearch()
    return `${getCancellationRequestPath()}?/submit${search ? `&${search.slice(1)}` : ''}`
  }

  function getFallbackSearch() {
    const params = new URLSearchParams()

    if (prefill.customerName) params.set('customerName', prefill.customerName)
    if (prefill.email) params.set('email', prefill.email)
    if (prefill.orderReference) params.set('orderReference', prefill.orderReference)
    return params.size ? `?${params}` : ''
  }

  function getSubmittedAtLabel(submittedAt?: string) {
    if (!submittedAt) return ''

    return new Intl.DateTimeFormat('da-DK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(submittedAt))
  }

  function handleOpen(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
    if (!isDialog || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    e.preventDefault()
    isOpen = true
  }

  function handleResult(actionResult: ActionResult) {
    if (actionResult.type !== 'success' && actionResult.type !== 'failure') return

    const data = actionResult.data as CancellationRequestActionData | undefined
    if (data?.action !== 'cancellationRequest') return

    localResult = data
  }
</script>

{#snippet formContent(close?: () => void)}
  {#if result?.success}
    <div class="flex flex-col gap-3 text-sm" data-testid="cancellation-request-success">
      <p class="font-bold">{result.message}</p>
      <p>
        Vi har registreret din fortrydelse{#if submittedAtLabel}
          den {submittedAtLabel}{/if}. Vi bruger den angivne e-mailadresse til den videre
        behandling.
      </p>
      {#if isDialog}
        <button
          class="btn w-fit justify-center px-5 py-3 text-sm"
          onclick={() => close?.()}
          type="button"
        >
          Luk
        </button>
      {/if}
    </div>
  {:else}
    <Form action={formAction} class="flex flex-col gap-4" bind:isSubmitting onResult={handleResult}>
      <p class="text-sm">
        Udfyld formularen for at fortryde dit køb. Vi bruger oplysningerne til at finde din ordre og
        sende dig en bekræftelse.
      </p>

      {#if result?.message}
        <p class="text-xs font-bold text-brand-red" role="alert">{result.message}</p>
      {/if}

      <Input
        autocomplete="name"
        aria-describedby={errors.customerName ? 'cancellation-customer-name-error' : undefined}
        label="Navn"
        name="customerName"
        required
        value={values.customerName}
      />
      {#if errors.customerName}
        <p class="-mt-3 text-xs text-brand-red" id="cancellation-customer-name-error">
          {errors.customerName}
        </p>
      {/if}

      <Input
        autocomplete="email"
        aria-describedby={errors.email ? 'cancellation-email-error' : undefined}
        label="E-mailadresse"
        name="email"
        required
        type="email"
        value={values.email}
      />
      {#if errors.email}
        <p class="-mt-3 text-xs text-brand-red" id="cancellation-email-error">{errors.email}</p>
      {/if}

      <Input
        aria-describedby={errors.orderReference ? 'cancellation-order-reference-error' : undefined}
        label="Ordrenummer"
        name="orderReference"
        required
        value={values.orderReference}
      />
      {#if errors.orderReference}
        <p class="-mt-3 text-xs text-brand-red" id="cancellation-order-reference-error">
          {errors.orderReference}
        </p>
      {/if}

      <Textarea label="Besked" maxlength={5000} name="message" value={values.message} />

      <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <button class="btn justify-center px-5 py-3 text-sm" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sender...' : 'Bekræft fortrydelse'}
        </button>
        {#if isDialog}
          <button class="text-sm underline" onclick={() => close?.()} type="button">Annuller</button
          >
        {/if}
      </div>
    </Form>
  {/if}
{/snippet}

{#if isDialog}
  <a class={triggerClass} href={resolve('/ordrer/fortryd')} onclick={handleOpen}>{triggerLabel}</a>

  <ModalDialog bind:open={isOpen} closeLabel="Luk fortrydelsesformular" title="Fortryd køb">
    {#snippet children(close)}
      {@render formContent(close)}
    {/snippet}
  </ModalDialog>
{:else}
  <section class="px-11 py-16">
    <div class="mx-auto max-w-2xl text-left">
      <h1 class="mb-6 text-lg font-bold" id={dialogTitleId}>Fortryd køb</h1>
      {@render formContent()}
    </div>
  </section>
{/if}
