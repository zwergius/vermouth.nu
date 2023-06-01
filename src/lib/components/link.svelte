<script lang="ts">
  export let route: string
  export let name: string
  export let size: string
</script>

<a style="font-size:{size}px" href={route} class="link">{name}</a>

<style>
  .link {
    text-decoration: none;
    font-size: var(--30px);
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
  @media only screen and (max-width: 1024px) {
    .link {
      font-size: var(--25px);
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
