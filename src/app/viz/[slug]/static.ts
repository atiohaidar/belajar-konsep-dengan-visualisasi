import { getAllSlugs } from "@/visualizations/registry";

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export { default } from "./page";
