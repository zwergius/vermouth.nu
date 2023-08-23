<script lang="ts">
  export let title = 'Vermouth.nu'
  export let description = 'Spansk vermouth-distributør i premium drinks til en god pris'
  export let tags = ['vermouth', 'spansk', 'fremragende varme', 'alkohol', 'premiun']
  export let ogType = 'www.vermouth.nu'
  export let image = '/Users/javiergascon/git/vermouth-nu/src/lib/assets/banner.webp'
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
    <meta name="twitter:image:alt" content={title} />
  {/if}
</svelte:head>
