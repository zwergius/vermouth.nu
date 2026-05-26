/**
 * Creates a local state that syncs with localStorage.
 * @template T
 * @param {string} key - The key to use in localStorage.
 * @param {T} initialValue - The initial value of the state.
 * @returns {T}
 */
export default function createLocalStorageState<T>(key: string, initialValue: T): T {
  // Use Svelte 5's $state with a custom storage mechanism
  let state = $state(initialValue)

  // Create a storage effect to sync with localStorage
  $effect(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        state = JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing localStorage', error)
      }
    }

    // Sync to localStorage whenever state changes
    localStorage.setItem(key, JSON.stringify(state))
  })

  return state
}

// Define the type for checkout state
// type CartFields = {
//   lines?: {
//     edges: Array<{ node: LineItemNode }>
//   }
// }

// Create checkout state
// export const checkout = createLocalState<CartFields>('checkout', {})

//   checkout.lines?.edges.map(({ node }) => node) || []
// )
