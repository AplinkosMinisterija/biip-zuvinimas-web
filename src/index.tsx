import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "styled-components";
import App from "./App";
import InstallButton from "./components/other/InstallButton";
import PWAInstallerPrompt from "./components/other/PWAInstallerPrompt";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import redux from "./state/store";
import { GlobalStyle, theme } from "./styles/index";
import NetworkStatusIndicator from "./components/other/NetworkStatusIndicator";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const { store, persistor } = redux;

root.render(
  <>
    <NetworkStatusIndicator />
    <PWAInstallerPrompt
      render={({ onClick }) => <InstallButton onClick={onClick} />}
      callback={(data) => console.log(data)}
    />
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
