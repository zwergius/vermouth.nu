<script lang="ts">
  export let title: string
  export let description: string
  export let tags = ['vermouth', 'spansk', 'alkohol', 'premium']
  export let ogType = 'website'
  export let image =
    'https://vermouth.nu/cdn/shop/files/552A24A2-C31B-4C91-A8B3-5A3C5F5EA8D3_300x300.JPG?v=1615928417'
  export let altImage = 'Forzudo'
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
  <meta name="twitter:image:alt" content={altImage} />
</svelte:head>
