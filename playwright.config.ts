import type { PlaywrightTestConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL

const config: PlaywrightTestConfig = {
  use: {
    baseURL,
  },
  webServer: baseURL
    ? undefined
    : {
        command: 'npm run build && npm run preview',
        port: 4173,
      },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
}

export default config
