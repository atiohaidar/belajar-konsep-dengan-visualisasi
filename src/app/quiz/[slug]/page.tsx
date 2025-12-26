import { notFound } from "next/navigation";
import { getConfigBySlug } from "@/visualizations/registry";
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
    // Ideally fetch all slugs that have quizzes
    // For now we can just return known ones or let it dynamic
    return [];
}
