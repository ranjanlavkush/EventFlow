import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist/public", // output goes to dist/public
    emptyOutDir: true,        // clears old files before each build
  },
});
