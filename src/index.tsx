import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import App from './App';
import NetworkStatusIndicator from './components/other/NetworkStatusIndicator';
import reportWebVitals from './reportWebVitals';
import redux from './state/store';
import { GlobalStyle, theme } from './styles/index';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const { store, persistor } = redux;
const queryClient = new QueryClient();
const env = import.meta.env;

if (env.VITE_SENTRY_DSN) {
  Sentry.init({
    environment: env.VITE_ENVIRONMENT,
    dsn: env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
    ],
    tracesSampleRate: 1,
    release: env.VITE_VERSION,
    tracePropagationTargets: [env.VITE_MAPS_HOST!],
  });
}

root.render(
  <>
    <NetworkStatusIndicator />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
