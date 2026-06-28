<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet<[() => void]>
    closeLabel?: string
    open?: boolean
    title: string
  }

  let { children, closeLabel = 'Luk dialog', title, open = $bindable(false) }: Props = $props()

  const titleId = $props.id()

  function dialogRef(node: HTMLDialogElement) {
    if (open && !node.open) {
      node.showModal()
    } else if (!open && node.open) {
      node.close()
    }
  }

  function close() {
    open = false
  }

  function handleBackdropClick(e: MouseEvent & { currentTarget: HTMLDialogElement }) {
    if (e.target === e.currentTarget) close()
  }
</script>

<dialog
  aria-labelledby={titleId}
  class="modal-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-brand-pink p-0 text-black sm:m-auto sm:h-fit sm:max-h-[90dvh] sm:w-11/12 sm:max-w-2xl sm:border sm:border-black"
  onclick={handleBackdropClick}
  onclose={close}
  {@attach dialogRef}
>
  <div class="relative p-6 md:p-8">
    <button
      aria-label={closeLabel}
      class="absolute right-4 top-4 text-2xl leading-none"
      onclick={close}
      type="button"
    >
      ×
    </button>
    <h2 class="mb-6 pr-8 text-lg font-bold" id={titleId}>{title}</h2>
    {@render children(close)}
  </div>
</dialog>

<style>
  :global(html:has(dialog.modal-dialog[open])) {
    overflow: hidden;
    scrollbar-gutter: stable;
  }

  dialog {
    opacity: 0;
    transform: translateY(0);
    transition:
      opacity 120ms ease-in,
      display 120ms allow-discrete,
      overlay 120ms allow-discrete;
  }

  dialog[open] {
    opacity: 1;
    transition:
      opacity 420ms ease-out,
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
      display 420ms allow-discrete,
      overlay 420ms allow-discrete;
  }

  dialog::backdrop {
    background-color: transparent;
    transition:
      background-color 120ms ease-in,
      display 120ms allow-discrete,
      overlay 120ms allow-discrete;
  }

  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 40%);
    transition:
      background-color 200ms ease-out,
      display 200ms allow-discrete,
      overlay 200ms allow-discrete;
  }

  @starting-style {
    dialog[open] {
      opacity: 0;
      transform: translateY(calc(50vh + 50%));
    }

    dialog[open]::backdrop {
      background-color: transparent;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog[open] {
      transform: none;
      transition:
        opacity 80ms ease-out,
        display 80ms allow-discrete,
        overlay 80ms allow-discrete;
    }

    @starting-style {
      dialog[open] {
        transform: none;
      }
    }
  }
</style>
