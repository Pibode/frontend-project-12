import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5001",
        changeOrigin: true,
        ws: true,
      },
    },
  },

  define: {
    "import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN": JSON.stringify(
      process.env.VITE_ROLLBAR_ACCESS_TOKEN,
    ),
  },
});
