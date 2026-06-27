import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => {
  return {
    prefill: {
      customerName: url.searchParams.get('customerName') ?? '',
      email: url.searchParams.get('email') ?? '',
      message: '',
      orderReference: url.searchParams.get('orderReference') ?? '',
    },
  }
}
