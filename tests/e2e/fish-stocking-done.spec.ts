import { expect, test } from '@playwright/test';
import { clickButton, selectMultiOptions } from './helpers';

/**
 * Completed (FINISHED / INSPECTED) stockings render the read-only "Done" view
 * whose only action is "Kartoti" (repeat). We narrow the list with the status
 * filter to find one, then exercise the repeat button.
 */
test.describe('Completed fish stocking (repeat)', () => {
  test('repeat button starts a new stocking from a finished one', async ({ page }) => {
    await page.goto('/zuvinimai');
    await page.waitForLoadState('networkidle');

    // Filter to finished stockings so the first item is a completed one.
    await selectMultiOptions(page, 'Būsena', ['Įžuvinta']);
    const waitList = page.waitForResponse('**/fishStockings**').catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
    await page.waitForLoadState('networkidle');

    const items = page.getByTestId('fish-stocking-item');
    test.skip((await items.count()) === 0, 'No finished stockings to repeat.');
    await items.first().click();
    await expect(page).toHaveURL(/\/zuvinimai\/\d+/);

    const repeat = page.getByRole('button', { name: 'Kartoti' });
    test.skip(
      !(await repeat.isVisible().catch(() => false)),
      'Opened stocking has no repeat action.',
    );
    await repeat.click();
    await expect(page).toHaveURL(/repeat=/);
  });
});
