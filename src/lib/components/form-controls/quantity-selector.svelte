<script lang="ts">
  import { tick } from 'svelte'
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

  let input: HTMLInputElement

  async function increment() {
    if (value < max) {
      value = Math.min(value + step, max)
      await tick()
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  async function decrement() {
    if (value > min) {
      value = Math.max(value - step, min)
      await tick()
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    const newValue = Number(e.currentTarget.value)

    if (!isNaN(newValue)) {
      value = Math.min(Math.max(newValue, min), max)
    }
  }
</script>

<div class="bg-black/10 border border-black flex items-center rounded-full *:size-10 lg:*:size-12">
  <button
    class="btn p-0 flex items-center justify-center border-none disabled:cursor-not-allowed"
    type="button"
    onclick={decrement}
    disabled={value <= min}
    aria-label="Decrease quantity"
  >
    -
  </button>

  <input
    {...rest}
    bind:this={input}
    class="font-bold text-center text-sm bg-transparent"
    type="number"
    bind:value
    oninput={handleInput}
    {min}
    {max}
    {step}
  />

  <button
    class="btn p-0 flex items-center justify-center border-none"
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
