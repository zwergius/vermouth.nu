<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface QuantitySelectorProps extends HTMLInputAttributes {
    max?: number
    min?: number
    step?: number
    value?: number
  }

  let {
    max = 100,
    min = 0,
    step = 1,
    value = $bindable(1),
    ...rest
  }: QuantitySelectorProps = $props()

  function increment() {
    if (value < max) {
      value = Math.min(value + step, max)
    }
  }

  function decrement() {
    if (value > min) {
      value = Math.max(value - step, min)
    }
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = Number(input.value)

    if (!isNaN(newValue)) {
      value = Math.min(Math.max(newValue, min), max)
    }
  }
</script>

<div class="bg-dark-pink border border-black flex items-center rounded-full">
  <button
    class="btn p-0 w-12 h-12 flex items-center justify-center border-none disabled:cursor-not-allowed"
    type="button"
    onclick={decrement}
    disabled={value <= min}
    aria-label="Decrease quantity"
  >
    -
  </button>

  <input
    {...rest}
    class="font-bold text-center text-sm w-12 h-12 bg-transparent"
    type="number"
    bind:value
    oninput={handleInput}
    {min}
    {max}
    {step}
  />

  <button
    class="btn p-0 w-12 h-12 flex items-center justify-center border-none"
    type="button"
    onclick={increment}
    disabled={value >= max}
    aria-label="Increase quantity"
  >
    +
  </button>
</div>

<style>
  input:focus,
  input:focus-visible {
    outline: none;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
