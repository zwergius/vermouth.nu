import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, url }) => {
  const { locale } = await parent()

  return {
    locale,
    prefill: {
      customerName: url.searchParams.get('customerName') ?? '',
      email: url.searchParams.get('email') ?? '',
      message: '',
      orderReference: url.searchParams.get('orderReference') ?? '',
    },
  }
}
