import { describe, expect, it } from 'vitest';
import { claimEGatesTicket, getSearchWithoutEGatesTicket } from './egatesTicket';

const firstTicket = '00000000-0000-4000-8000-000000000001';
const secondTicket = '00000000-0000-4000-8000-000000000002';

describe('VIISP tickets', () => {
  it('allows each ticket to be sent only once, even after another ticket', () => {
    expect(claimEGatesTicket(firstTicket)).toBe(true);
    expect(claimEGatesTicket(firstTicket)).toBe(false);
    expect(claimEGatesTicket(secondTicket)).toBe(true);
    expect(claimEGatesTicket(firstTicket)).toBe(false);
  });

  it('removes the completed ticket and preserves other search parameters', () => {
    expect(
      getSearchWithoutEGatesTicket(`?show=one&ticket=${firstTicket}&show=two`, firstTicket),
    ).toBe('show=one&show=two');
    expect(getSearchWithoutEGatesTicket(`?ticket=${firstTicket}`, firstTicket)).toBe('');
  });

  it('leaves the search alone when the callback has changed', () => {
    expect(getSearchWithoutEGatesTicket(`?ticket=${secondTicket}`, firstTicket)).toBeUndefined();
    expect(getSearchWithoutEGatesTicket('?show=one', firstTicket)).toBeUndefined();
  });
});
