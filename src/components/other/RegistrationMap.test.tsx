import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../../styles';
import { locationTexts } from '../../utils/texts';
import { FishStockingLocation } from '../../utils/types';
import api from '../../utils/api';
import Map from './RegistrationMap';

// The map itself is an external iframe; the app only learns what was
// clicked through a postMessage carrying an origin that must match
// VITE_MAPS_HOST, and a GeoJSON FeatureCollection (LKS94 metres) as a JSON
// string. This helper reproduces exactly that contract.
const MAP_ORIGIN = 'https://maps.test';

const dispatchMapClick = (coordinates: [number, number]) => {
  // The message handler runs its synchronous state updates (setLoading,
  // setShowLocationPopup, setGeom) before it ever awaits anything, so the
  // dispatch itself — not just the later assertions — needs the act()
  // wrapper.
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: MAP_ORIGIN,
        data: {
          mapIframeMsg: {
            userObjects: JSON.stringify({
              type: 'FeatureCollection',
              features: [{ type: 'Feature', geometry: { type: 'Point', coordinates } }],
            }),
          },
        },
      }),
    );
  });
};

const renderMap = (onSave = vi.fn()) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Map iframeRef={{ current: null }} onSave={onSave} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
  return { onSave };
};

describe('RegistrationMap — GRPK candidate popup', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_MAPS_HOST', MAP_ORIGIN);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('shows the real water body name with a keyboard-reachable request control instead of the dead end, and requests the clicked point', async () => {
    const candidate: FishStockingLocation = {
      name: 'Naikupė',
      cadastral_id: null,
      municipality: { id: '65', name: 'Jurbarko r. sav.' },
      category: 'Upė',
      source: 'GRPK_CANDIDATE',
    };
    vi.spyOn(api, 'getLocations').mockResolvedValue([candidate]);
    const requestSpy = vi.spyOn(api, 'requestPendingLocation').mockResolvedValue({
      name: 'Naikupė',
      cadastral_id: 'NR-000001',
      municipality: { id: '65', name: 'Jurbarko r. sav.' },
      category: 'Upė',
      source: 'PENDING',
    } as FishStockingLocation);

    renderMap();
    dispatchMapClick([328452, 6133555]);

    expect(await screen.findByText('Naikupė')).toBeInTheDocument();
    expect(screen.getByText(locationTexts.grpkCandidate)).toBeInTheDocument();
    expect(screen.queryByText(locationTexts.notFound)).not.toBeInTheDocument();

    // A real, focusable <button> found by role + accessible name — not a
    // div with an onClick, which would not be reachable by Tab and would
    // not surface as role "button" to assistive tech.
    const requestButton = screen.getByRole('button', { name: locationTexts.requestButton });
    requestButton.focus();
    expect(requestButton).toHaveFocus();

    // Operable, not just focusable: Enter on a focused button is the
    // browser's native activation, simulated here rather than a mouse click.
    // The click handler awaits requestPendingLocation and then updates
    // state again (closing the popup), so the whole interaction — not just
    // the keypress — needs to be inside one act() to let that settle.
    await act(async () => {
      await userEvent.keyboard('{Enter}');
      await Promise.resolve();
    });

    expect(requestSpy).toHaveBeenCalledWith({ x: 328452, y: 6133555 });
    expect(
      screen.queryByRole('button', { name: locationTexts.requestButton }),
    ).not.toBeInTheDocument();
  });

  it('never lets a GRPK_CANDIDATE reach onSave', async () => {
    const candidate: FishStockingLocation = {
      name: 'Šmulžiogis',
      cadastral_id: null,
      municipality: { id: '17', name: 'Šilutės r. sav.' },
      category: 'Natūralus ežeras',
      source: 'GRPK_CANDIDATE',
    };
    vi.spyOn(api, 'getLocations').mockResolvedValue([candidate]);

    const { onSave } = renderMap();
    dispatchMapClick([329527, 6132126]);

    expect(await screen.findByText('Šmulžiogis')).toBeInTheDocument();

    // onSave was called once, for the "no selectable match" branch, but
    // never with the candidate's data — a GRPK_CANDIDATE has no
    // cadastral_id, so it must never become the chosen location.
    expect(onSave).toHaveBeenCalledWith({ geom: null, data: null });
    expect(onSave).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ source: 'GRPK_CANDIDATE' }),
      }),
    );
  });

  it('still auto-selects when the lookup returns one selectable UETK entry', async () => {
    const location: FishStockingLocation = {
      name: 'Nemunas',
      cadastral_id: '12345678',
      municipality: { id: '111', name: 'Šilutės r. sav.' },
      category: 'Upė',
      source: 'UETK',
    };
    vi.spyOn(api, 'getLocations').mockResolvedValue([location]);

    const { onSave } = renderMap();
    dispatchMapClick([329527, 6132126]);

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        geom: expect.objectContaining({ type: 'FeatureCollection' }),
        data: location,
      }),
    );

    // The popup auto-closes on a single selectable match — the candidate UI
    // never appears for a genuinely registered water body.
    expect(screen.queryByText(locationTexts.notFound)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: locationTexts.requestButton }),
    ).not.toBeInTheDocument();
  });
});
