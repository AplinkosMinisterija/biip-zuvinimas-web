import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { STORAGE_STATE } from '../../playwright.config';
import { login } from './helpers/auth';

/**
 * Runs once before everything else. Logs in through the UI, picks a profile,
 * and saves the authenticated browser state (cookies) to STORAGE_STATE so the
 * rest of the suite starts already logged in.
 */
setup('authenticate', async ({ page }) => {
  await login(page);

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
});
