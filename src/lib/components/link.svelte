<script lang="ts">
  export let href: string
</script>

<a {href} class="link"><slot /></a>

<style>
  .link {
    text-decoration: none;
    font-weight: bold;
    color: var(--secondary);
    display: block;
    position: relative;
    border-bottom: 1px solid var(--red30);
  }
  .link:before {
    content: '';
    height: 10px;
    width: 100%;
    background-color: var(--red30);
    position: absolute;
    bottom: 0;
    left: 0;
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
