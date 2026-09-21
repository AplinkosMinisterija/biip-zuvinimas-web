import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom has no Blob URL implementation. The design-system package bundles
// maplibre-gl, which calls URL.createObjectURL at import time (not lazily
// on map render), so this has to exist purely to let the import succeed.
if (typeof window.URL.createObjectURL !== 'function') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock');
}
if (typeof window.URL.revokeObjectURL !== 'function') {
  window.URL.revokeObjectURL = vi.fn();
}
