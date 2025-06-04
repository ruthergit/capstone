import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy:{
      '/api' : {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        headers:{
          Accept: 'application/json',
          "Content-type": 'application/json'
        }
      }
    }
  },
  plugins: [react(), tailwindcss(), svgr()],
});
