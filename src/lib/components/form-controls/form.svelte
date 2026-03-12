<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit'
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  interface FormProps extends HTMLFormAttributes {
    children: Snippet
    onResult?: (result: ActionResult) => void
    ref?: HTMLFormElement
    reset?: boolean
    isSubmitting?: boolean
  }

  let {
    children,
    onResult = () => null,
    ref = $bindable(),
    reset = false,
    isSubmitting = $bindable(false),
    ...rest
  }: FormProps = $props()

  const handleSubmit: SubmitFunction = ({ cancel, formElement }) => {
    if (isSubmitting) cancel()

    const isValid = formElement.reportValidity()
    if (!isValid) {
      const elements = Array.from(formElement.elements) as HTMLInputElement[]
      const firstInvalidField = elements.find((element) => !element.validity.valid)
      if (firstInvalidField) {
        firstInvalidField.focus()
        firstInvalidField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
      // isSubmitting = false
      cancel()
      return
    }
    isSubmitting = true

    return async ({ result, update }) => {
      // showMessage = result.type
      // if (showMessage === 'success' || showMessage === 'redirect') {
      //   if (!disableFeedback) notifications.add(successMessage)
      //   if (onSuccess) onSuccess(result)
      // } else if (!disableFeedback) {
      //   notifications.add(errorMessage, true)
      // }
      onResult(result)
      isSubmitting = false
      update({ reset })
    }
  }
</script>

<form bind:this={ref} method="POST" novalidate {...rest} use:enhance={handleSubmit}>
  {@render children()}
</form>
