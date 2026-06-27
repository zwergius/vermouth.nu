<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'

  interface InputProps extends HTMLInputAttributes {
    label: string
    name: string
  }

  let {
    id,
    label,
    max,
    min,
    minlength,
    maxlength,
    name,
    onblur,
    oninput,
    pattern,
    placeholder, // placeholder is disabled, we set it hardcoded to ' ' space to trigger :placeholder-shown css pseudo class
    step,
    type = 'text',
    value = $bindable(),
    ...rest
  }: InputProps = $props()

  const inputId = $derived(id ?? name)

  let errorMessage = $state('')
  let touched = $state(false)

  function handleErrorMessage(e: Event & { currentTarget: HTMLInputElement }) {
    const {
      customError,
      patternMismatch,
      // rangeOverflow,
      // rangeUnderflow,
      tooShort,
      typeMismatch,
      valid,
      valueMissing,
    } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = `${label} skal udfyldes.`
    } else if (tooShort && minlength) {
      errorMessage = `Ugyldigt ${label}, mindst ${minlength} tegn.`
    } else if (typeMismatch && type === 'email') {
      errorMessage = 'Indtast en gyldig e-mail fx: navn@acme.dk'
    } else if (patternMismatch && type === 'tel') {
      errorMessage = `Ugyldigt ${label}.`
    } else if (patternMismatch && pattern === '\\d*') {
      errorMessage = `Ugyldigt ${label}, kun tal 0-9 tilladt.`
      // } else if (patternMismatch && patternErrorMessage) {
      //   errorMessage = patternErrorMessage
      // } else if (patternMismatch && invalidErrorMessage) {
      //   errorMessage = invalidErrorMessage
      // } else if (patternMismatch) {
      //   errorMessage = invalidErrorMessage
      // } else if (rangeOverflow && (type === 'date' || type === 'datetime-local') && max) {
      //   errorMessage = invalidErrorMessage
      // } else if (rangeUnderflow && (type === 'date' || type === 'datetime-local') && min) {
      //   errorMessage = invalidErrorMessage
    }
  }

  function handleOnBlur(e: FocusEvent & { currentTarget: HTMLInputElement }) {
    touched = true
    e.currentTarget.checkValidity()

    if (onblur) {
      onblur(e)
    }
  }

  function handleOnInvalid(e: Event & { currentTarget: HTMLInputElement }) {
    e.preventDefault()
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: Event & { currentTarget: HTMLInputElement }) {
    const { value: newValue } = e.currentTarget

    if (type?.match(/^(number|range)$/)) {
      value = newValue === '' ? null : +newValue
    } else {
      value = newValue
    }

    if (type === 'datetime-local' || type === 'date') {
      touched = true
    }

    if (oninput) {
      oninput(e)
    }

    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
  }
</script>

<div class="block relative border border-dark-blue">
  <input
    aria-invalid={touched && Boolean(errorMessage) ? true : undefined}
    class:touched
    class="peer p-6 text-sm placeholder:text-transparent w-full bg-white/40
    focus:bg-white
    data-[touched=true]:invalid:bg-white"
    data-touched={touched}
    id={inputId}
    {max}
    {maxlength}
    {min}
    {minlength}
    {name}
    onblur={handleOnBlur}
    oninvalid={handleOnInvalid}
    oninput={handleOnInput}
    {pattern}
    placeholder={label}
    {step}
    {type}
    bind:value
    {...rest}
  />
  <label
    for={inputId}
    class="text-xs absolute left-6 duration-100 ease-linear translate-y-0
      peer-placeholder-shown:translate-y-6 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500"
  >
    {label}
  </label>
  {#if touched && Boolean(errorMessage)}
    <p
      class="text-xs text-brand-red absolute left-6 bottom-0"
      id="{name}-error"
      role="alert"
      transition:fade
    >
      {errorMessage}
    </p>
  {/if}
</div>

<!-- <label -->
<!--   for="email" -->
<!--   class="absolute left-4 ml-1 px-1 -translate-y-3 bg-white text-sm duration-100 ease-linear -->
<!--   peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -->
<!--   peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm">PASSWORD</label -->
<!-- > -->
