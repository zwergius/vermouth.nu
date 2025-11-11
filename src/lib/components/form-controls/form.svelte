<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  interface FormProps extends HTMLFormAttributes {
    children: Snippet
    onSubmit: (event: SubmitEvent) => Promise<void>
    ref?: HTMLFormElement
  }

  let { children, ref = $bindable(), onSubmit, ...rest }: FormProps = $props()

  let isSubmitting = false

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    if (isSubmitting) return

    const form = event.currentTarget as HTMLFormElement
    const isValid = form.reportValidity()

    if (!isValid) {
      const elements = Array.from(form.elements) as HTMLInputElement[]
      const firstInvalidField = elements.find((el) => !el.validity.valid)

      firstInvalidField?.focus()
      firstInvalidField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      isSubmitting = false
      return
    }

    isSubmitting = true
    await onSubmit(event)
    isSubmitting = false
  }
</script>

<form bind:this={ref} novalidate {...rest} onsubmit={handleSubmit}>
  {@render children()}
</form>
