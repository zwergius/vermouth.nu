<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'

  interface TextareaProps extends HTMLTextareaAttributes {
    label: string
    name: string
  }

  let {
    'aria-describedby': ariaDescribedBy,
    id,
    label,
    maxlength,
    minlength,
    name,
    onblur,
    oninput,
    placeholder,
    value = $bindable(),
    ...rest
  }: TextareaProps = $props()

  let errorMessage = $state('')
  let touched = $state(false)

  const textareaId = $derived(id ?? name)
  const errorId = $derived(`${name}-error`)
  const describedBy = $derived(
    [ariaDescribedBy, touched && errorMessage ? errorId : undefined].filter(Boolean).join(' ') ||
      undefined,
  )

  function handleErrorMessage(e: Event & { currentTarget: HTMLTextAreaElement }) {
    const { customError, tooLong, tooShort, valid, valueMissing } = e.currentTarget.validity

    if (valid) {
      errorMessage = ''
    } else if (customError) {
      errorMessage = e.currentTarget.validationMessage
    } else if (valueMissing) {
      errorMessage = `${label} skal udfyldes.`
    } else if (tooShort && minlength) {
      errorMessage = `Ugyldigt ${label}, mindst ${minlength} tegn.`
    } else if (tooLong && maxlength) {
      errorMessage = `Ugyldigt ${label}, højst ${maxlength} tegn.`
    }
  }

  function handleOnBlur(e: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
    touched = true
    e.currentTarget.checkValidity()
    handleErrorMessage(e)
    onblur?.(e)
  }

  function handleOnInvalid(e: Event & { currentTarget: HTMLTextAreaElement }) {
    e.preventDefault()
    touched = true
    handleErrorMessage(e)
  }

  function handleOnInput(e: Event & { currentTarget: HTMLTextAreaElement }) {
    value = e.currentTarget.value
    oninput?.(e)

    if (touched) {
      e.currentTarget.checkValidity()
      handleErrorMessage(e)
    }
  }
</script>

<div class="relative block border border-dark-blue">
  <textarea
    aria-describedby={describedBy}
    aria-invalid={touched && Boolean(errorMessage) ? true : undefined}
    class="peer block min-h-28 w-full resize-y bg-white/40 p-6 text-sm placeholder:text-transparent focus:bg-white data-[touched=true]:invalid:bg-white"
    data-touched={touched}
    id={textareaId}
    {maxlength}
    {minlength}
    {name}
    onblur={handleOnBlur}
    oninput={handleOnInput}
    oninvalid={handleOnInvalid}
    placeholder={label}
    bind:value
    {...rest}
  ></textarea>
  <label
    class="absolute left-6 top-0 translate-y-0 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-6 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500"
    for={textareaId}
  >
    {label}
  </label>
  {#if touched && errorMessage}
    <p
      class="absolute bottom-0 left-6 text-xs text-brand-red"
      id={errorId}
      role="alert"
      transition:fade
    >
      {errorMessage}
    </p>
  {/if}
</div>
