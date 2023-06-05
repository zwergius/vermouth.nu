<script lang="ts">
  export let href: string
</script>

<a {href} class="link"><slot /></a>

<style>
  .link {
    display: flex;
    text-decoration: none;
    font-weight: bold;
    color: var(--interactive-button);
    position: relative;
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
