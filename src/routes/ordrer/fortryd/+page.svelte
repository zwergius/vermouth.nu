<script lang="ts">
  import CancellationRequestDialog from '$lib/components/cancellation-request-dialog.svelte'
  import type { PageProps } from './$types'

  const { data, form }: PageProps = $props()
</script>

<svelte:head>
  <title>Fortryd køb | Vermouth.nu</title>
</svelte:head>

<CancellationRequestDialog actionData={form} mode="page" prefill={data.prefill} />
