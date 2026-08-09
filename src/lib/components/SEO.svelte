<script lang="ts">
  const {
    description,
    image,
    imageAlt,
    title,
    url,
  }: {
    description: string
    image?: string
    imageAlt?: string
    title: string
    url?: string
  } = $props()
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="description" content={description} />
  <meta name="keywords" content={['vermouth', 'spansk', 'alkohol', 'premium'].join(',')} />
  <meta property="og:type" content="website" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- <meta name="twitter:card" content="summary_large_image" /> -->
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:url" content={url ?? 'https://www.vermouth.nu'} />
  {#if image}
    <meta name="twitter:image" content={image} />
    {#if imageAlt}<meta name="twitter:image:alt" content={imageAlt} />{/if}
  {/if}

  <!--  Essential META Tags -->

  <meta property="og:locale" content="da" />
  <meta property="fb:app_id" content="" />
  <meta property="og:site_name" content="Vermouth.NU" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if image}<meta property="og:image" itemprop="image" content={image} />{/if}
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url ?? 'https://www.vermouth.nu'} />
</svelte:head>
