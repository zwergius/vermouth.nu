<script lang="ts">
  export let title = 'Vermouth.nu'
  export let description = 'Spansk vermouth-distributør i premium drinks til en god pris'
  export let tags = ['vermouth', 'spansk', 'fremragende varme', 'alkohol', 'premiun']
  export let ogType = 'www.vermouth.nu'
  export let image =
    'https://vermouth.nu/cdn/shop/files/552A24A2-C31B-4C91-A8B3-5A3C5F5EA8D3_300x300.JPG?v=1615928417'
  export let altImage = 'Forzudo er et af eksemplerne på vermouth, som du kan finde'
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
    <meta property="og:title" content={title} />
  {/if}
  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
  {/if}
  {#if tags.length > 0}
    <meta name="keywords" content={tags.join(',')} />
  {/if}
  <meta property="og:type" content={ogType} />
  <!-- <meta name="twitter:card" content="summary_large_image" /> -->
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:url" content={ogType} />
  {#if image}
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={altImage} />
  {/if}
</svelte:head>
