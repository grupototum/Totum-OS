import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
