<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'
  import CheckedIcon from './checked-icon.svelte'

  interface Props extends HTMLInputAttributes {
    label: string
    name: string
  }

  let { checked = $bindable(), id, label, name, ...restProps }: Props = $props()
  const inputId = id ? id : name

  let touched = $state(false)
  let errorMessage = $state('')

  function handleErrorMessage(e: Event & { currentTarget: HTMLInputElement }) {
    const { customError, valid, valueMissing } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = e.currentTarget.validationMessage
    }
  }

  function handleOnInvalid(e: Event & { currentTarget: HTMLInputElement }) {
    e.preventDefault() // Hides default bubble
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: Event & { currentTarget: HTMLInputElement }) {
    ;({ checked } = e.currentTarget)

    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
  }
</script>

<div class="relative text-xs flex items-center gap-2">
  <input
    aria-invalid={touched && Boolean(errorMessage) ? true : undefined}
    aria-describedby={touched && Boolean(errorMessage) ? `${name}-error` : undefined}
    class:touched
    class="appearance-none border border-dark-blue size-8 checked:bg-white p-1 bg-light-pink
      data-[touched=true]:invalid:border-brand-red data-[touched=true]:invalid:outline-2 data-[touched=true]:invalid:outline data-[touched=true]:invalid:outline-brand-red"
    bind:checked
    data-touched={touched}
    id={inputId}
    {name}
    oninvalid={handleOnInvalid}
    oninput={handleOnInput}
    {...restProps}
    type="checkbox"
  />
  <label for={inputId}>
    {@html label}
  </label>
  {#if checked}
    <div
      class="absolute left-0 top-0 size-8 pointer-events-none"
      transition:fade={{ duration: 100 }}
    >
      <CheckedIcon />
    </div>
  {/if}
  {#if touched && Boolean(errorMessage)}
    <p
      id="{name}-error"
      class="absolute -bottom-7 left-0 text-brand-red text-xs text-right whitespace-nowrap"
      transition:fade
      role="alert"
    >
      {errorMessage}
    </p>
  {/if}
</div>
