<script lang="ts">
  export let description: string
  export let image: string
  export let imageAlt: string
  export let ogType = 'website'
  export let tags = ['vermouth', 'spansk', 'alkohol', 'premium']
  export let title: string
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="description" content={description} />
  <meta property="og:description" content={description} />

  <meta name="keywords" content={tags.join(',')} />

  <meta property="og:type" content={ogType} />
  <!-- <meta name="twitter:card" content="summary_large_image" /> -->
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:url" content={ogType} />

  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
