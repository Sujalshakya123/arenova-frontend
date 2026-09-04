import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PlatformGamesProvider } from "./context/PlatformGamesContext.tsx";
import { ensureDemoSeedVersion } from "./data/demoSeed";

ensureDemoSeedVersion();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <PlatformGamesProvider>
        <App />
      </PlatformGamesProvider>
    </AuthProvider>
  </BrowserRouter>,
);
