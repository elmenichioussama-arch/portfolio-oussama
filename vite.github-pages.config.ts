import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const fromProject = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: fromProject("./github-pages"),
  base: "/portfolio-oussama/",
  publicDir: fromProject("./public"),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "next/image",
        replacement: fromProject("./github-pages/src/next-image.tsx")
      },
      {
        find: "@",
        replacement: fromProject(".")
      }
    ]
  },
  build: {
    outDir: fromProject("./github-pages-dist"),
    emptyOutDir: true
  }
});
