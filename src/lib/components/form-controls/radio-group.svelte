<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'
  import CheckedIcon from './checked-icon.svelte'

  type RadioOption = { description?: string; label: string; price?: string; value: string }

  interface RadioGroupProps extends HTMLInputAttributes {
    groupLabel: string
    layout?: 'stacked' | 'responsive-grid'
    name: string
    onChange?: (e: Event & { currentTarget: HTMLInputElement }) => void
    options: RadioOption[]
    optionContent?: Snippet<[RadioOption]>
    selected?: string
  }

  let {
    disabled,
    groupLabel,
    layout = 'stacked',
    name,
    onChange,
    options,
    optionContent,
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

<fieldset
  class:responsive-grid={layout === 'responsive-grid'}
  class:custom-content={Boolean(optionContent)}
  class="relative rounded"
  {disabled}
>
  <legend class="text-sm font-bold mb-4">
    <span class="">{groupLabel}</span>
  </legend>
  <ul class="border border-dark-blue">
    {#each options as option (option.value)}
      {@const { description, label, price, value } = option}
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
          <div class="text-xs leading-normal flex-1" class:min-w-0={Boolean(optionContent)}>
            {#if optionContent}
              {@render optionContent(option)}
            {:else}
              <div class="flex justify-between gap-3 font-semibold">
                <p>{label}</p>
                <p class="ml-auto whitespace-nowrap text-right">{price}</p>
              </div>
              <p>{description}</p>
            {/if}
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

<style>
  fieldset.responsive-grid label,
  fieldset.custom-content label {
    padding-inline-end: 1rem;
  }

  fieldset.custom-content label {
    padding-block: 0.75rem;
  }

  @media (min-width: 1024px) {
    fieldset.responsive-grid ul {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      border: 0;
    }

    fieldset.responsive-grid li {
      border: 1px solid currentColor;
    }
  }
</style>
