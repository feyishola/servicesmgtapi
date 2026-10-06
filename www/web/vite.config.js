import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // MapLibre's worker is an ES module (see MapView.jsx)
  worker: { format: "es" },
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
});
