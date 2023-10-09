import { error } from '@sveltejs/kit'
import { CardNames } from './types'
import type { CardData } from './types'

const cardsData: Record<string, CardData> = {
  [CardNames.Christian]: {
    passGoogle:
      'https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJidXNpbmVzcy1jYXJkc0BidXNpbmVzcy1jYXJkcy0zOTk2MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbInd3dy5leGFtcGxlLmNvbSJdLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImdlbmVyaWNDbGFzc2VzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjIyNjgwMjAuY2hyaXN0aWFuLXZlcm1vdXRoMSJ9XSwiZ2VuZXJpY09iamVjdHMiOlt7ImlkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC5jaHJpc3RpYW4tdmVybW91dGgiLCJjbGFzc0lkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC5jaHJpc3RpYW4tdmVybW91dGgxIiwic3RhdGUiOiJBQ1RJVkUiLCJsb2dvIjp7InNvdXJjZVVyaSI6eyJ1cmkiOiJodHRwczovL2ltYWdlZGVsaXZlcnkubmV0L3JPVGM5dEtDVFFCYzl6dGtpQlRYX3cvZjczMDE2MGItYTc5ZC00ZGYzLTcwNmEtNjY3YTEwOWRhNTAwL3B1YmxpYyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkxPR09fSU1BR0VfREVTQ1JJUFRJT04ifX19LCJjYXJkVGl0bGUiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IlZlcm1vdXRoLm51In19LCJoZWFkZXIiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkNocmlzdGlhbiBad2VyZ2l1cyJ9fSwidGV4dE1vZHVsZXNEYXRhIjpbeyJpZCI6InRlbDoiLCJoZWFkZXIiOiJUZWw6IiwiYm9keSI6IiszNCA2MjIgNzYzIDcwMyJ9LHsiaWQiOiJtYWlsOiIsImhlYWRlciI6Ik1haWw6IiwiYm9keSI6ImNocmlzdGlhbkB2ZXJtb3V0aC5udSJ9LHsiaWQiOiJjdnIiLCJoZWFkZXIiOiJDVlI6IiwiYm9keSI6IjQwNjQ5Mzk1In0seyJpZCI6ImFkZHJlc3MiLCJoZWFkZXIiOiJBZGRyZXNzIiwiYm9keSI6ImMvbyBUaG9tYXMgVmFzZSBCb2xzZXRoIFxuT3ZlcmdhZGVuIE5lZGVuIFZhbmRldCA0OSBCLCBzdCAudHYgXG4xNDE0IEvDuGJlbmhhdm4gSyJ9XSwiaGV4QmFja2dyb3VuZENvbG9yIjoiI2YwYWFhOSIsImJhcmNvZGUiOnsidHlwZSI6IlFSX0NPREUiLCJ2YWx1ZSI6Imh0dHBzOi8vd3d3LnZlcm1vdXRoLm51L2NhcmRzL2NocmlzdGlhbiIsImFsdGVybmF0ZVRleHQiOiJTaGFyZSJ9LCJoZXJvSW1hZ2UiOnsic291cmNlVXJpIjp7InVyaSI6Imh0dHBzOi8vaW1hZ2VkZWxpdmVyeS5uZXQvck9UYzl0S0NUUUJjOXp0a2lCVFhfdy85MDRhYzEyNC1kZDAxLTQ0NWEtMzI2ZC0xYTEzZTM2MjUyMDAvcHVibGljIn0sImNvbnRlbnREZXNjcmlwdGlvbiI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJkYS1ESyIsInZhbHVlIjoiSEVST19JTUFHRV9ERVNDUklQVElPTiJ9fX19XX0sImlhdCI6MTY5NjI1MjU3MX0.nsYiFsbIVQcGR7Frrpdcrx5qi4kqKCaB_85yCWBfjvCrJAKmmUpc5We1YJYEvOv-m6lzxmDmzgM2igzhHi3giqIN5mIdi5iWrfxF8WL-yYWuZYzPiFVqH-obM6FmACJBJAsyzoh9PEKGK3SD_WrcJBtwDXpcnFQrQUX4H47VCm4l-o-I6FPHBcJYS5-wcTpkurXJHvnjzvbDpwD8pDjAl5f1R8BR_jyNHBCmQjpwPFk9XAPi-ktgNtjvrpwN8EMxe1l-tTedQX-BaV5CRtFD_pQLIuiSiwu5mAkAJMB8cbBooiW4XJtAIqcRLkvmuNiT9prTVLYreXdjjcDT4K5gvQ',
  },
  [CardNames.Christoffer]: {
    passGoogle:
      'https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJidXNpbmVzcy1jYXJkc0BidXNpbmVzcy1jYXJkcy0zOTk2MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbInd3dy5leGFtcGxlLmNvbSJdLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImdlbmVyaWNDbGFzc2VzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjIyNjgwMjAuY2hyaXN0b2ZmZXItdmVybW91dGgxIn1dLCJnZW5lcmljT2JqZWN0cyI6W3siaWQiOiIzMzg4MDAwMDAwMDIyMjY4MDIwLmNocmlzdG9mZmVyLXZlcm1vdXRoIiwiY2xhc3NJZCI6IjMzODgwMDAwMDAwMjIyNjgwMjAuY2hyaXN0b2ZmZXItdmVybW91dGgxIiwic3RhdGUiOiJBQ1RJVkUiLCJsb2dvIjp7InNvdXJjZVVyaSI6eyJ1cmkiOiJodHRwczovL2ltYWdlZGVsaXZlcnkubmV0L3JPVGM5dEtDVFFCYzl6dGtpQlRYX3cvZjczMDE2MGItYTc5ZC00ZGYzLTcwNmEtNjY3YTEwOWRhNTAwL3B1YmxpYyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkxPR09fSU1BR0VfREVTQ1JJUFRJT04ifX19LCJjYXJkVGl0bGUiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IlZlcm1vdXRoLm51In19LCJoZWFkZXIiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkNocmlzdG9mZmVyIFp3ZXJnaXVzIn19LCJ0ZXh0TW9kdWxlc0RhdGEiOlt7ImlkIjoidGVsOiIsImhlYWRlciI6IlRlbDoiLCJib2R5IjoiKzQ1IDI2IDM1IDM2IDA2In0seyJpZCI6Im1haWw6IiwiaGVhZGVyIjoiTWFpbDoiLCJib2R5IjoiaW5mb0B2ZXJtb3V0aC5udSJ9LHsiaWQiOiJjdnIiLCJoZWFkZXIiOiJDVlI6IiwiYm9keSI6IjQwNjQ5Mzk1In0seyJpZCI6ImFkZHJlc3MiLCJoZWFkZXIiOiJBZGRyZXNzIiwiYm9keSI6ImMvbyBUaG9tYXMgVmFzZSBCb2xzZXRoIFxuT3ZlcmdhZGVuIE5lZGVuIFZhbmRldCA0OSBCLCBzdCAudHYgXG4xNDE0IEvDuGJlbmhhdm4gSyJ9XSwiaGV4QmFja2dyb3VuZENvbG9yIjoiI2YwYWFhOSIsImJhcmNvZGUiOnsidHlwZSI6IlFSX0NPREUiLCJ2YWx1ZSI6Imh0dHBzOi8vd3d3LnZlcm1vdXRoLm51L2NhcmRzL2NocmlzdG9mZmVyIiwiYWx0ZXJuYXRlVGV4dCI6IlNoYXJlIn0sImhlcm9JbWFnZSI6eyJzb3VyY2VVcmkiOnsidXJpIjoiaHR0cHM6Ly9pbWFnZWRlbGl2ZXJ5Lm5ldC9yT1RjOXRLQ1RRQmM5enRraUJUWF93LzkwNGFjMTI0LWRkMDEtNDQ1YS0zMjZkLTFhMTNlMzYyNTIwMC9wdWJsaWMifSwiY29udGVudERlc2NyaXB0aW9uIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImRhLURLIiwidmFsdWUiOiJIRVJPX0lNQUdFX0RFU0NSSVBUSU9OIn19fX1dfSwiaWF0IjoxNjk2MjUyNTcxfQ.GA7Al44Ap1KcwM6fVdZustl71sCShwljoJJRt4aL0_1fasDMp7eMygxr0ackg_uXI3GZo1udN4lhXRdYrHpdOlupAktL_UYrWOyBz0PNbb85uVk_vhsMpYmB8Mb1YLzyzAHsgn8zftvv_kfmCjiw4cmPhhOlY7bXcrR4ATgrFXwG-8hAyRQQDmZl3Ez-ugEs7TlcWcHDi8P1Pp4Srmsu4kOvN6vsUXxqcHIpxU-qD6W1Py1ca8CGxExyaZ2tbmbRBcdNVbnjrxPmABKdAfN1v-WSY8uPi3vFZuOxtVDL5HZqWypOgz_SRESdiQXsMZ__O9KM_e6vEr2GpFbR1o4LQw',
  },
  [CardNames.Thomas]: {
    passGoogle:
      'https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJidXNpbmVzcy1jYXJkc0BidXNpbmVzcy1jYXJkcy0zOTk2MDkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbInd3dy5leGFtcGxlLmNvbSJdLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImdlbmVyaWNDbGFzc2VzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjIyNjgwMjAudGhvbWFzLXZlcm1vdXRoMSJ9XSwiZ2VuZXJpY09iamVjdHMiOlt7ImlkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC50aG9tYXMtdmVybW91dGgiLCJjbGFzc0lkIjoiMzM4ODAwMDAwMDAyMjI2ODAyMC50aG9tYXMtdmVybW91dGgxIiwic3RhdGUiOiJBQ1RJVkUiLCJsb2dvIjp7InNvdXJjZVVyaSI6eyJ1cmkiOiJodHRwczovL2ltYWdlZGVsaXZlcnkubmV0L3JPVGM5dEtDVFFCYzl6dGtpQlRYX3cvZjczMDE2MGItYTc5ZC00ZGYzLTcwNmEtNjY3YTEwOWRhNTAwL3B1YmxpYyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IkxPR09fSU1BR0VfREVTQ1JJUFRJT04ifX19LCJjYXJkVGl0bGUiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IlZlcm1vdXRoLm51In19LCJoZWFkZXIiOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZGEtREsiLCJ2YWx1ZSI6IlRob21hcyBWYXNlIn19LCJ0ZXh0TW9kdWxlc0RhdGEiOlt7ImlkIjoidGVsOiIsImhlYWRlciI6IlRlbDoiLCJib2R5IjoiKzQ1IDI3IDUxIDEzIDQ5In0seyJpZCI6Im1haWw6IiwiaGVhZGVyIjoiTWFpbDoiLCJib2R5IjoiaW5mb0B2ZXJtb3V0aC5udSJ9LHsiaWQiOiJjdnIiLCJoZWFkZXIiOiJDVlI6IiwiYm9keSI6IjQwNjQ5Mzk1In0seyJpZCI6ImFkZHJlc3MiLCJoZWFkZXIiOiJBZGRyZXNzIiwiYm9keSI6ImMvbyBUaG9tYXMgVmFzZSBCb2xzZXRoIFxuT3ZlcmdhZGVuIE5lZGVuIFZhbmRldCA0OSBCLCBzdCAudHYgXG4xNDE0IEvDuGJlbmhhdm4gSyJ9XSwiaGV4QmFja2dyb3VuZENvbG9yIjoiI2YwYWFhOSIsImJhcmNvZGUiOnsidHlwZSI6IlFSX0NPREUiLCJ2YWx1ZSI6Imh0dHBzOi8vd3d3LnZlcm1vdXRoLm51L2NhcmRzL3Rob21hcyIsImFsdGVybmF0ZVRleHQiOiJTaGFyZSJ9LCJoZXJvSW1hZ2UiOnsic291cmNlVXJpIjp7InVyaSI6Imh0dHBzOi8vaW1hZ2VkZWxpdmVyeS5uZXQvck9UYzl0S0NUUUJjOXp0a2lCVFhfdy85MDRhYzEyNC1kZDAxLTQ0NWEtMzI2ZC0xYTEzZTM2MjUyMDAvcHVibGljIn0sImNvbnRlbnREZXNjcmlwdGlvbiI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJkYS1ESyIsInZhbHVlIjoiSEVST19JTUFHRV9ERVNDUklQVElPTiJ9fX19XX0sImlhdCI6MTY5NjI1MjU3MX0.hdPNaQlKmhCNWEHchl_F64-oo-zSfI4oaaFslea3mjZcKuiJKyP5WJJcEhQ6e69ioydJgLImiYDRscpUl5Zh16gIOdGs6veAcz4TWc7R9RixRNMDeTvdl0-8oP3HOilMoWVEYEe0ylQ5E9PWhgKkHtjb8um4Tjt6UKdL9Ban4uoVNMUCMxNVzeU268RiLD61kKEF-Ejul7ZW7-sC4Zx7xmvTjl6DhEEpNw_zI5uiXNY71PEPOd_vhtHA0rJx-yGwW6etLhwDv1uiCqg98wVhGo9bulq4zD5KqywC1wr6TotKD2mw8N-HVGpHs-dwYQ9x-T7ZNpV37LSqfJz-FDUUmA',
  },
}

/** @type {import('./$types').PageLoad} */
export function load({ params, url }) {
  const cardNameParam = params.cardsName
  const cardData = cardsData[cardNameParam]
  const pkpass = `${url.origin}/${cardNameParam}.pkpass`
  if (!cardData) {
    throw error(404)
  }
  return {
    pkpass,
    cardData,
  }
}
