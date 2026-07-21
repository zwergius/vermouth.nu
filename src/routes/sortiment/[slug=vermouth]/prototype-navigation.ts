import { replaceState } from '$app/navigation'

export function replacePrototypeUrl(url: URL, state: App.PageState) {
  replaceState(url, state)
}
