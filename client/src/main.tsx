import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function reportError(error: string, context: string) {
  try {
    fetch("/api/debug/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error, context, userAgent: navigator.userAgent }),
    }).catch(() => {});
  } catch {}
}

window.addEventListener("error", (e) => {
  reportError(`${e.message} at ${e.filename}:${e.lineno}:${e.colno}`, "window.onerror");
});

window.addEventListener("unhandledrejection", (e) => {
  reportError(String(e.reason), "unhandledrejection");
});

reportError("App starting", "init");

createRoot(document.getElementById("root")!).render(<App />);
