export const manifestForPlugIn = {
  registerType: 'autoUpdate',
  includeAssests: ['favicon.ico', 'apple-touc-icon.png', 'masked-icon.svg'],
  manifest: {
    short_name: 'Įžuvinimas',
    name: 'BĮIP Įžuvinimas',
    icons: [
      {
        src: 'b-icon.png',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/png',
      },
      {
        src: 'b-icon.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'b-icon.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    theme_color: '#171717',
    background_color: '#0a1353',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
      },
    ],
  },
};
