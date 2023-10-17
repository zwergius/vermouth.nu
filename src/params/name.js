const validNames = ['christian', 'christoffer', 'thomas']

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  if (validNames.includes(param)) {
    return true
  }
  return false
}
