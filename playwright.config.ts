import type { PlaywrightTestConfig } from '@playwright/test'

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL
const baseURL = externalBaseURL ?? 'http://localhost:5173'

const config: PlaywrightTestConfig = {
  use: {
    baseURL,
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 5173',
        port: 5173,
        reuseExistingServer: true,
      },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
}

export default config
