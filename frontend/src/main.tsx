import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import keycloak from "./auth/keycloak";

async function startApp() {
    try {
        const authenticated = await keycloak.init({
            onLoad: "login-required",
            pkceMethod: "S256"
        });

        if (!authenticated) {
            await keycloak.login();
            return;
        }
        createRoot(
            document.getElementById("root")!
        ).render(
            <StrictMode>
                <App />
            </StrictMode>
        );
    } catch (error) {
        console.error(
            "Failed to initialize authentication:",
            error
        );
    }
}

startApp();