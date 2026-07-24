/// <reference types="vite/client" />

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioExperience } from "@/app/portfolio-experience";
import "@/app/globals.css";
import { projects } from "@/data/portfolio";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Le conteneur principal du portfolio est introuvable.");
}

const assetPrefix = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(root).render(
  <StrictMode>
    <PortfolioExperience
      projects={projects}
      assetPrefix={assetPrefix}
      contactMode="mailto"
    />
  </StrictMode>
);
