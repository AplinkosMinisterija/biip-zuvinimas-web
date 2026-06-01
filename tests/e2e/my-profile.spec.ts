import { expect, test } from '@playwright/test';
import { clickButton, fillField, inputByLabel } from './helpers';

test.describe('My profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mano-profilis');
    await page.waitForLoadState('networkidle');
  });

  test('name and surname are read-only', async ({ page }) => {
    await expect(inputByLabel(page, 'Vardas')).toBeDisabled();
    await expect(inputByLabel(page, 'Pavardė')).toBeDisabled();
  });

  test('invalid email is rejected', async ({ page }) => {
    const original = await inputByLabel(page, 'Elektroninis paštas').inputValue();
    await fillField(page, 'Elektroninis paštas', 'not-an-email');
    await clickButton(page, 'Išsaugoti');
    await expect(page.getByText('Blogas el. pašto adresas')).toBeVisible();
    // Restore the field so we never persist a bad value.
    await fillField(page, 'Elektroninis paštas', original);
  });

  test('"Išvalyti" resets edited fields', async ({ page }) => {
    const phone = inputByLabel(page, 'Telefono numeris');
    const original = await phone.inputValue();
    await fillField(page, 'Telefono numeris', '+37060000000');
    await clickButton(page, 'Išvalyti');
    await expect(phone).toHaveValue(original);
  });

  test('saving a valid profile shows a success toast', async ({ page }) => {
    const phone = inputByLabel(page, 'Telefono numeris');
    const original = await phone.inputValue();
    // Re-save the existing (valid) values so we trigger the update without
    // actually changing the user's data.
    await fillField(page, 'Telefono numeris', original || '+37060000000');
    await clickButton(page, 'Išsaugoti');
    await expect(page.getByText('Profilis atnaujintas')).toBeVisible({ timeout: 15_000 });
  });
});
