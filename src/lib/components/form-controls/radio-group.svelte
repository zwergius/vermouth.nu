<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'
  import CheckedIcon from './checked-icon.svelte'

  interface RadioGroupProps extends HTMLInputAttributes {
    groupLabel: string
    name: string
    onChange?: (e: Event & { currentTarget: HTMLInputElement }) => void
    options: Array<{ description?: string; label: string; price?: string; value: string }>
    selected?: string
  }

  let {
    disabled,
    groupLabel,
    name,
    onChange,
    options,
    selected = $bindable(),
    ...restProps
  }: RadioGroupProps = $props()

  let touched = $state(false)
  let errorMessage = $state('')

  function handleErrorMessage(e: Event & { currentTarget: HTMLInputElement }) {
    const { customError, valid, valueMissing } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = `Vælg venligst en ${groupLabel}.`
    }
  }

  function handleOnInvalid(e: Event & { currentTarget: HTMLInputElement }) {
    e.preventDefault() // Hides default bubble
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: Event & { currentTarget: HTMLInputElement }) {
    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
    onChange?.(e)
  }
</script>

<fieldset class="relative rounded" {disabled}>
  <legend class="text-sm font-bold mb-4">
    <span class="">{groupLabel}</span>
  </legend>
  <ul class="border border-dark-blue">
    {#each options as { description, label, price, value }}
      <li class="border-b last-of-type:border-none border-dark-blue">
        <label
          class="relative pl-4 py-5 pr-24 flex items-center gap-4 bg-white/40 has-[:checked]:bg-black/20"
          for={value}
        >
          <input
            bind:group={selected}
            class="appearance-none rounded-none border border-dark-blue size-8 shrink-0 checked:bg-white p-1 bg-white/40
            data-[touched=true]:invalid:border-brand-red data-[touched=true]:invalid:outline-2 data-[touched=true]:invalid:outline data-[touched=true]:invalid:outline-brand-red"
            data-touched={touched}
            {disabled}
            id={value}
            {name}
            oninvalid={handleOnInvalid}
            oninput={handleOnInput}
            type="radio"
            {value}
            {...restProps}
          />
          <div class="text-xs leading-normal flex-1">
            <div class="flex justify-between font-semibold">
              <p>{label}</p>
              <p>{price}</p>
            </div>
            <p>{description}</p>
          </div>

          {#if selected === value}
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 size-8 pointer-events-none"
              transition:fade={{ duration: 100 }}
            >
              <CheckedIcon />
            </div>
          {/if}
        </label>
      </li>
    {/each}
  </ul>
  {#if touched && Boolean(errorMessage)}
    <p
      id="{name}-error"
      class="absolute -bottom-6 left-4 text-brand-red text-xs text-right whitespace-nowrap"
      transition:fade
      role="alert"
    >
      {errorMessage}
    </p>
  {/if}
</fieldset>
