const validNames = ['christian', 'christoffer', 'thomas']

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  return validNames.includes(param)
}
