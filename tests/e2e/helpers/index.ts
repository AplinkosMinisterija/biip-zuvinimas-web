export * from './fields';
export * from './auth';

/** A label tag we stamp into created records so they're easy to spot/clean up. */
export const E2E_TAG = '[E2E]';

/** Search term for finding a water body (UETK) when creating a stocking. */
export const waterBodyQuery = process.env.E2E_WATER_BODY || 'Vilnia';

/** Format a Date as yyyy-MM-dd for DatePicker inputs. */
export function isoDate(d: Date): string {
  const p = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** A date `days` in the future (stockings must be scheduled ahead of minTime). */
export function futureDate(days = 14): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
