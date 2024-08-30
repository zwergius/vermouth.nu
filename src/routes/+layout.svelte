<script>
  import '../app.css'
  import logo from '$lib/images/vermouth-nu-logo.svg'
  import HamburgerMenu from '$lib/components/hamburger-menu.svelte'
</script>

<header class="sticky top-0 z-50 flex h-[--header-height] flex-col bg-brand-pink">
  <a class="block bg-brand-yellow py-1.5 text-center text-xs" href="/"
    >BOOK EN SMAGNING&nbsp;<span class="underline">NU</span></a
  >
  <nav class="flex-1 border-b border-t border-black text-sm">
    <ul class="nav-list h-full">
      <li class="col-span-2 lg:col-span-1">
        <a href="/"><img width="137" height="57" src={logo} alt="Vermouth.nu" /></a>
      </li>
      <li class="hidden lg:block"><a href="/sortiment">Sortiment</a></li>
      <li class="hidden lg:block"><a href="/smagninger">Smagninger</a></li>
      <li class="hidden lg:block"><a href="/inspiration">Inspiration</a></li>
      <li class="hidden lg:block"><a href="/forhandlere">Forhandlere</a></li>
      <li class="hidden lg:block"><a href="/om-os">Om Os</a></li>
      <li class="lg:hidden">
        <HamburgerMenu>
          <ul class="hamburger-nav-list">
            <li><a href="/sortiment">Sortiment</a></li>
            <li><a href="/smagninger">Smagninger</a></li>
            <li><a href="/inspiration">Inspiration</a></li>
            <li><a href="/forhandlere">Forhandlere</a></li>
            <li><a href="/om-os">Om Os</a></li>
          </ul>
        </HamburgerMenu>
      </li>
    </ul>
  </nav>
</header>

<main class="flex flex-1 flex-col">
  <slot></slot>
</main>

<footer>
  <div class="px-11 py-16 text-center lg:text-left">
    <h3 class="mb-6 text-xs">FANG OS PÅ</h3>
    <p class="mb-6 md:mb-8">
      <a href="tel:+4526353606">26 35 36 06</a>
      <br />
      <a href="mailto:info@vermouth.nu">info@vermouth.nu</a>
      <br />
      Nørre Farimagsgade 6, 1364 Kbh K
    </p>
  </div>
  <div
    class="grid grid-flow-row grid-rows-2 text-sm md:grid-flow-col md:grid-cols-2 md:grid-rows-1"
  >
    <figure class="border-y border-black py-5 pl-16 md:border-r">
      <figcaption class="font-bold">LINKS</figcaption>
      <ul>
        <li><a href="/sortiment">Sortiment</a></li>
        <li><a href="/smagninger">Smagninger</a></li>
        <li><a href="/inspiration">Inspiration</a></li>
        <li><a href="/forhandlere">Forhandlere</a></li>
        <li><a href="/om-os">Om Os</a></li>
      </ul>
    </figure>
    <figure class="border-b border-black py-5 pl-16 md:border-y">
      <figcaption class="font-bold">FØLG OS</figcaption>
      <ul>
        <li><a href="/sortiment">Sortiment</a></li>
        <li><a href="/smagninger">Smagninger</a></li>
      </ul>
    </figure>
  </div>
  <div class="bg-brand-yellow px-16 py-1.5 text-xs md:text-center">
    <p>© Copyright - Vermouth.nu</p>
  </div>
</footer>

<style lang="postcss">
  .nav-list {
    @apply grid grid-cols-3 items-center lg:grid-cols-6;
  }

  .nav-list > li {
    @apply h-full border-r border-black  uppercase last-of-type:border-none;
  }

  .nav-list > li > a {
    @apply flex h-full flex-col items-center justify-center py-4;
  }

  .hamburger-nav-list > li {
    @apply border-b border-black py-8 pl-16 leading-6;
  }

  @media (min-width: 480px) {
    footer {
    }
  }
</style>
