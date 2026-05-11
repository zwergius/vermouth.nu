<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/state'
  import { PUBLIC_COOKIE_YES_ID, PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public'
  import '../app.css'
  import logo from '$lib/images/vermouth-nu-logo.svg'
  import { initializeAnalytics } from '$lib/helpers/analytics'
  import HamburgerMenu from '$lib/components/hamburger-menu.svelte'
  import type { LayoutProps } from './$types'
  import { scale } from 'svelte/transition'
  import { dev } from '$app/environment'

  const routes = ['sortiment', 'smagninger', 'inspiration', 'forhandlere', 'om-os']
  const { children, data }: LayoutProps = $props()
  const { cart } = $derived(data)

  onMount(() => {
    if (!PUBLIC_GA_MEASUREMENT_ID) return

    initializeAnalytics(PUBLIC_GA_MEASUREMENT_ID)
  })
</script>

<svelte:head>
  <!-- Start cookieyes banner -->
  {#if PUBLIC_COOKIE_YES_ID && !dev}
    <script
      id="cookieyes"
      type="text/javascript"
      src={`https://cdn-cookieyes.com/client_data/${PUBLIC_COOKIE_YES_ID}/script.js`}
    >
    </script>
    <!-- End cookieyes banner -->
  {/if}
  {#if true}
    <!-- Google Tag Manager -->
    <script>
      ;(function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'GTM-PL5P58FS')
    </script>
    <!-- End Google Tag Manager -->
  {/if}
  {#if PUBLIC_GA_MEASUREMENT_ID}
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_MEASUREMENT_ID}`}
    ></script>
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
    </script>
  {/if}
</svelte:head>

{#snippet anchor(route: string, hasCartIcon?: true)}
  <a
    aria-current={page.url.pathname.includes(route) ? 'page' : false}
    class="hover:font-bold aria-[current=page]:font-bold flex-1 h-full flex items-center justify-center gap-4 py-4"
    href="/{route}"
  >
    {route.replace('-', ' ')}
    {#if hasCartIcon}
      {@render cartIcon()}
    {/if}
  </a>
{/snippet}

{#snippet cartIcon()}
  <span class="relative">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
      <rect x="1" y="5" width="14" height="14" stroke="currentColor" stroke-width="2" />
      <rect x="4" width="2" height="9" fill="currentColor" />
      <rect x="10" width="2" height="9" fill="currentColor" />
      <rect x="4" width="8" height="2" fill="currentColor" />
    </svg>
    {#if cart.items?.length}
      <span
        class="bg-brand-red text-white rounded-full size-4 flex justify-center items-center text-xs absolute -bottom-2 -left-2"
        transition:scale>{cart.items?.length}</span
      >
    {/if}
  </span>
{/snippet}

<header class="sticky top-0 z-50 flex h-[--header-height] flex-col bg-brand-pink">
  <a class="block bg-brand-yellow py-1.5 text-center text-xs" href="/smagninger"
    >BOOK EN SMAGNING&nbsp;<span class="underline">NU</span></a
  >
  <nav class="flex-1 border-b border-t border-black text-sm">
    <ul class="nav-list h-full">
      <li class="col-span-2 lg:col-span-1">
        <a class="flex h-full flex-col lg:items-center justify-center p-4" href="/"
          ><img width="137" height="57" src={logo} alt="Vermouth.nu" /></a
        >
      </li>
      <li class="hidden lg:block">{@render anchor('sortiment')}</li>
      <li class="hidden lg:block">{@render anchor('smagninger')}</li>
      <li class="hidden lg:block">{@render anchor('inspiration')}</li>
      <li class="hidden lg:block">{@render anchor('forhandlere')}</li>
      <li class="hidden lg:flex">
        <div class="h-full flex-1 border-r border-black">
          {@render anchor('om-os')}
        </div>
        <div class="h-full flex-1">
          {@render anchor('kurv', true)}
        </div>
      </li>
      <li class="lg:hidden flex">
        <HamburgerMenu>
          <ul class="hamburger-nav-list">
            <li><a href="/sortiment">Sortiment</a></li>
            <li><a href="/smagninger">Smagninger</a></li>
            <li><a href="/inspiration">Inspiration</a></li>
            <li><a href="/forhandlere">Forhandlere</a></li>
            <li><a href="/om-os">Om Os</a></li>
          </ul>
        </HamburgerMenu>
        <a
          class="flex h-full flex-1 flex-col items-center justify-center py-4 border-l border-black text-brand-blue"
          href="/kurv"
        >
          {@render cartIcon()}
        </a>
      </li>
    </ul>
  </nav>
</header>

<main class="flex flex-1 flex-col">
  {@render children()}
</main>

<footer>
  <div class="px-11 py-16 text-center lg:text-left">
    <h3 class="mb-6 text-xs">FANG OS PÅ</h3>
    <p class="mb-6 md:mb-8">
      <a href="tel:+4526353606">26 35 36 06</a>
      <br />
      <a href="mailto:info@vermouth.nu">info@vermouth.nu</a>
      <br />
      Overgaden Neden Vandet 49b, 1414 Kbh K
    </p>
  </div>
  <div
    class="grid grid-flow-row grid-rows-3 text-sm md:grid-flow-col md:grid-cols-3 md:grid-rows-1"
  >
    <figure class="border-y border-black py-5 pl-16 md:border-r">
      <figcaption class="font-bold">LINKS</figcaption>
      <ul>
        {#each routes as route}
          <li>
            <a
              class="hover:font-bold aria-[current=page]:font-bold capitalize"
              href="/{route}"
              aria-current={page.url.pathname.includes(route) ? 'page' : false}
              >{route.replace('-', ' ')}</a
            >
          </li>
        {/each}
      </ul>
    </figure>
    <figure class="border-b border-black py-5 pl-16 md:border-y">
      <figcaption class="font-bold">FØLG OS</figcaption>
      <ul>
        <li>
          <a
            class="hover:font-bold"
            rel="external"
            href="https://www.facebook.com/profile.php?id=100063790380353">Facebook</a
          >
        </li>
        <li>
          <a class="hover:font-bold" rel="external" href="https://www.instagram.com/vermouth.nu"
            >Instagram</a
          >
        </li>
      </ul>
    </figure>
    <figure
      class="border-b border-black py-5 px-16 md:border-l md:border-y text-left flex flex-col"
    >
      <figcaption class="font-bold">POLICES</figcaption>
      <ul>
        <li>
          <a class="hover:font-bold" rel="external" href="/handelsbetingelser">Handelsbetingelser</a
          >
        </li>
        <li>
          <a class="hover:font-bold" rel="external" href="/fortrolighedspolitik"
            >Fortrolighedspolitik</a
          >
        </li>
      </ul>
      <figure class="mt-auto md:ml-auto overflow-visible">
        <img class="h-8 w-auto max-w-n" src="/kort-logoer.png" alt="Betalingskort muligheder" />
      </figure>
    </figure>
  </div>
  <div class="bg-brand-yellow px-16 py-1.5 text-xs text-center">
    <p>© Copyright - Vermouth.nu</p>
  </div>
</footer>

<style lang="postcss">
  .nav-list {
    @apply grid grid-cols-3 items-center lg:grid-cols-6;
  }

  .nav-list > li {
    @apply h-full border-l border-black  uppercase first-of-type:border-none;
  }

  .hamburger-nav-list > li {
    @apply border-b border-black py-8 pl-16 leading-6;
  }

  @media (min-width: 480px) {
    footer {
    }
  }
</style>
