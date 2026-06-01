import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Login credentials + target URL live in .env.e2e (gitignored).
// Copy .env.e2e.example -> .env.e2e and fill in your details.
dotenv.config({ path: path.resolve(__dirname, '.env.e2e') });

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:8080';

// Where the authenticated browser state (cookies) is cached after global setup.
export const STORAGE_STATE = path.resolve(__dirname, 'tests/e2e/.auth/state.json');

export default defineConfig({
  testDir: './tests/e2e',
  // Each spec mutates shared staging data, so keep runs deterministic/serial.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL,
    locale: 'lt-LT',
    timezoneId: 'Europe/Vilnius',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Slow down a touch in headed mode so flows are watchable.
    launchOptions: { slowMo: process.env.PWSLOWMO ? Number(process.env.PWSLOWMO) : 0 },
  },

  projects: [
    // 1) Authenticate once, cache cookies to STORAGE_STATE.
    { name: 'setup', testMatch: /global\.setup\.ts/ },

    // 2) Everything else reuses that authenticated state.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],

  // Playwright boots the Vite dev server itself; reuses one if already running.
  webServer: {
    command: 'yarn start',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
