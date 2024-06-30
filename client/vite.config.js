import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",

        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
