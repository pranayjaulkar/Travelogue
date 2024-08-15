import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, host: true },
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
        manualChunks: {
          reactRedux: ["react-redux", "redux", "redux-thunk"],
          mui: ["@emotion/react", "@emotion/styled", "@mui/icons-material", "@mui/material"],
        },
      },
    },
  },
});
