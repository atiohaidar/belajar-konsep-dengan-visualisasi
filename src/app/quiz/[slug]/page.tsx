import { notFound } from "next/navigation";
import { getConfigBySlug, getAllConfigs } from "@/visualizations/registry";
import QuizInterface from "@/components/Quiz/QuizInterface";

interface QuizPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { slug } = await params;
    const config = getConfigBySlug(slug);

    if (!config || !config.quiz) {
        notFound();
    }

    return (
        <QuizInterface
            questions={config.quiz}
            slug={slug}
            title={config.judul}
        />
    );
}

export async function generateStaticParams() {
    const configs = getAllConfigs();
    return configs
        .filter((config) => config.quiz && config.quiz.length > 0)
        .map((config) => ({
            slug: config.slug,
        }));
}
