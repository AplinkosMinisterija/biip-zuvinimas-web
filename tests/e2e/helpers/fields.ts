/**
 * Centralized selector + interaction helpers for the @aplinkosministerija
 * design-system fields. ALL fragile selector logic lives here so there is ONE
 * place to adjust if a control's DOM differs.
 *
 * What we learned by probing the LIVE rendered DOM (not the source):
 *
 *  - Every labeled control — text, select, multiselect, async-select AND date —
 *    renders a plain <input id="<label text>">. The <label htmlFor> is
 *    "field-<label>", which does NOT match the input id, so getByLabel() does
 *    NOT work. We target the input by `[id="<label>"]`.
 *
 *  - Selects are NOT antd in the DOM (no roles). Each opens a custom dropdown of
 *    <div> options inside the field's `.fieldWrapperChildren`. Options carry no
 *    role, so we click them by text, scoped to the field (the same text, e.g. a
 *    status, can also appear in list items elsewhere).
 *
 *  - Date fields open a react-datepicker calendar; we click an enabled day.
 *    Time fields open an inline react-datepicker time list.
 *
 *  - CheckBox / RadioOptions are custom: we click their visible label text.
 */
import { expect, Locator, Page } from '@playwright/test';

const toPage = (scope: Page | Locator): Page =>
  'page' in scope ? (scope as Locator).page() : (scope as Page);

const esc = (value: string) => value.replace(/"/g, '\\"');

/* ------------------------------------------------------------------ inputs */

/** A text/number/email/password/phone input located by its label text. */
export const inputByLabel = (scope: Page | Locator, label: string): Locator =>
  scope.locator(`[id="${esc(label)}"]`);

/** Fill a plain text-like field. `scope` can be a row locator for repeats. */
export async function fillField(
  scope: Page | Locator,
  label: string,
  value: string,
  index = 0,
): Promise<void> {
  const input = inputByLabel(scope, label).nth(index);
  await input.click();
  await input.fill('');
  await input.fill(value);
}

/* ----------------------------------------------------- custom design-system select */

// The design-system Select/MultiSelect/AsyncSelect are NOT antd. Each renders a
// plain <input id="<label>"> plus a custom dropdown of <div> options inside the
// field's `.fieldWrapperChildren`. Options carry no role, so we click them by
// text — but SCOPED to the field wrapper, because the same text (e.g. a status)
// can also appear in list items elsewhere on the page.

/**
 * The `.fieldWrapperChildren` element that contains a field's <input> AND its
 * dropdown options. Scoping option clicks here avoids matching the same text
 * (e.g. a status name) elsewhere on the page.
 */
export function dsField(scope: Page | Locator, label: string): Locator {
  // `has` must be a page-rooted locator so its selector is matched RELATIVE to
  // each .fieldWrapperChildren candidate. A scope-rooted locator (e.g. a
  // getByTestId row) carries its prefix and matches nothing.
  return scope
    .locator('.fieldWrapperChildren')
    .filter({ has: toPage(scope).locator(`[id="${esc(label)}"]`) })
    .first();
}

/** The clickable option, by text, scoped to a field's dropdown. */
const optionInField = (field: Locator, optionText: string): Locator =>
  field.getByText(optionText, { exact: true });

/** Open a select and pick an option by visible text. */
export async function selectOption(
  scope: Page | Locator,
  label: string,
  optionText: string,
): Promise<void> {
  const field = dsField(scope, label);
  await inputByLabel(field, label).first().click();
  await optionInField(field, optionText).first().click();
}

/** Read the first clickable option's text from an open field dropdown. */
async function firstOptionText(field: Locator, timeout = 15_000): Promise<string> {
  const deadline = timeout;
  const start = await field.evaluate(() => performance.now());
  // Poll the DOM until an option (cursor:pointer leaf with text) appears.
  for (;;) {
    const text = await field.evaluate((fwc) => {
      const opts = Array.from(fwc.querySelectorAll('*')).filter(
        (e) =>
          e.children.length === 0 &&
          (e.textContent || '').trim() &&
          getComputedStyle(e).cursor === 'pointer',
      );
      return opts[0]?.textContent?.trim() || '';
    });
    if (text) return text;
    const elapsed = (await field.evaluate(() => performance.now())) - start;
    if (elapsed > deadline) return '';
    await field.page().waitForTimeout(250);
  }
}

/** Open a select and pick the FIRST available option (text unknown). */
export async function selectFirstOption(scope: Page | Locator, label: string): Promise<string> {
  const field = dsField(scope, label);
  await inputByLabel(field, label).first().click();
  const text = await firstOptionText(field);
  if (text) await optionInField(field, text).first().click();
  return text;
}

/** Pick several options in a multi-select, then close the dropdown. */
export async function selectMultiOptions(
  scope: Page | Locator,
  label: string,
  optionTexts: string[],
): Promise<void> {
  const page = toPage(scope);
  const field = dsField(scope, label);
  await inputByLabel(field, label).first().click();
  for (const text of optionTexts) {
    await optionInField(field, text).first().click();
  }
  // Tab blurs the field to close the option list WITHOUT closing a surrounding
  // popup (Escape would close the whole filter popup).
  await page.keyboard.press('Tab');
}

/** Type a query into an async select and pick the first loaded result. */
export async function searchAndPickFirst(
  scope: Page | Locator,
  label: string,
  query: string,
): Promise<string> {
  const field = dsField(scope, label);
  const input = inputByLabel(field, label).first();
  await input.click();
  await input.fill(query);
  const text = await firstOptionText(field, 20_000); // async options take a moment
  if (text) await optionInField(field, text).first().click();
  return text;
}

/* ----------------------------------------------------------------- date */

/**
 * Set a react-datepicker date field by opening its calendar and clicking an
 * enabled day. `position` picks the first or last enabled day in the month
 * (use 'first' for a "from" date and 'last' for a "to" date). Clicking a day
 * auto-closes the calendar, avoiding overlap with the next field.
 */
export async function pickDate(
  scope: Page | Locator,
  label: string,
  position: 'first' | 'last' = 'last',
  index = 0,
): Promise<void> {
  const page = toPage(scope);
  await inputByLabel(scope, label).nth(index).click();
  const enabled =
    '.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)';
  let days = page.locator(enabled);
  await days
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
    .catch(() => undefined);
  if ((await days.count()) === 0) {
    await page.locator('.react-datepicker__navigation--next').click();
    await page.waitForTimeout(300);
    days = page.locator(enabled);
  }
  await (position === 'first' ? days.first() : days.last()).click();
}

/** Pick the first available time from a TimePicker's inline time list. */
export async function pickTime(scope: Page | Locator, label = 'Laikas', index = 0): Promise<void> {
  const page = toPage(scope);
  await inputByLabel(scope, label).nth(index).click();
  const slot = page
    .locator('.react-datepicker__time-list-item:not(.react-datepicker__time-list-item--disabled)')
    .first();
  await slot.waitFor({ state: 'visible', timeout: 10_000 });
  await slot.click();
}

/* --------------------------------------------------------- checkbox / radio */

/** Toggle a CheckBox identified by its visible label text. */
export async function toggleCheckBox(
  scope: Page | Locator,
  label: string,
  index = 0,
): Promise<void> {
  const page = toPage(scope);
  await page.getByText(label, { exact: false }).nth(index).click();
}

/** Choose a RadioOptions value by its visible option text. */
export async function chooseRadio(scope: Page | Locator, optionText: string): Promise<void> {
  const page = toPage(scope);
  await page.getByText(optionText, { exact: true }).first().click();
}

/* ---------------------------------------------------------------- buttons */

export function button(scope: Page | Locator, name: string, exact = true): Locator {
  return scope.getByRole('button', { name, exact });
}

export async function clickButton(
  scope: Page | Locator,
  name: string,
  exact = true,
): Promise<void> {
  await button(scope, name, exact).click();
}

/* ----------------------------------------------------------- assertions */

/** Assert a per-field validation error message is shown somewhere on the page. */
export async function expectError(scope: Page | Locator, message: string): Promise<void> {
  await expect(toPage(scope).getByText(message).first()).toBeVisible();
}
