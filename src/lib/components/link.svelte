<script lang="ts">
  export let href: string
  export let rel: string | undefined = ''
</script>

<a class="link" {href} {rel}><slot /></a>

<style>
  .link {
    max-width: 100%;
    text-decoration: none;
    font-weight: bold;
    display: inline-flex;
    color: var(--interactive-button);
    position: relative;
    gap: 10px;
    z-index: 1;
    border-bottom: 1px solid var(--highlight);
  }
  .link:before {
    content: '';
    height: 10px;
    width: 100%;
    background-color: var(--highlight);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.2s ease-in-out;
  }
  @media only screen and (max-width: 1024px) {
    .link {
      gap: 3px;
    }
  }
  @media (hover: hover) {
    a:hover {
      cursor: pointer;
    }
    .link:hover::before {
      transform: scaleY(1);
      transform-origin: bottom;
    }
  }
</style>
