import { getAllSlugs } from "@/visualizations/registry";
import VisualizationClient from "./VisualizationClient";

// Generate static params for all visualizations
export function generateStaticParams() {
    return getAllSlugs().map((slug) => ({
        slug,
    }));
}

export default function VisualizationPage() {
    return <VisualizationClient />;
}
