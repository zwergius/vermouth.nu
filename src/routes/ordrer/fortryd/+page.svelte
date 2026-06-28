<script lang="ts">
  import CancelRequestForm from '$lib/components/cancel-request-form.svelte'
  import type { PageProps } from './$types'

  const { data, form }: PageProps = $props()
</script>

<svelte:head>
  <title>Fortryd køb | Vermouth.nu</title>
</svelte:head>

<section class="px-11 py-16">
  <div class="mx-auto max-w-2xl text-left">
    <h1 class="mb-6 text-lg font-bold">Fortryd køb</h1>
    <CancelRequestForm actionData={form} locale={data.locale} prefill={data.prefill} />
  </div>
</section>
