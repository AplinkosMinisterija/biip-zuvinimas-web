import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "styled-components";
import App from "./App";
import NetworkStatusIndicator from "./components/other/NetworkStatusIndicator";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import redux from "./state/store";
import { GlobalStyle, theme } from "./styles/index";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const { store, persistor } = redux;

const queryClient = new QueryClient();

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.4
});

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
  </>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
