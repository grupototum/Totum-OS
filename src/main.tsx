import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Service Worker (PWA) ─────────────────────────────────────────────────────
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.info("[PWA] Nova versão disponível. Recarregue para atualizar.");
            }
          });
        });
      })
      .catch((err) => {
        console.error("[PWA] Falha ao registrar service worker:", err);
      });
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Silencia console em produção ─────────────────────────────────────────────
// Mantém console.error para erros críticos reais.
if (import.meta.env.PROD) {
  console.log   = () => {};
  console.info  = () => {};
  console.debug = () => {};
  console.warn  = () => {};
}
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(<App />);
