import { projects } from "@/data/portfolio";
import { PortfolioExperience } from "./portfolio-experience";

export default function Home() {
  return <PortfolioExperience projects={projects} />;
}
