"use client";

import Link from "next/link";
import { getAllConfigs } from "@/visualizations/registry";
import { VisualizationCategory } from "@/visualizations/types";
import ProgressSummary from "@/components/ProgressSummary";
import ProgressBadge from "@/components/ProgressBadge";

// Konfigurasi kategori
const kategoriConfig: Record<VisualizationCategory, { label: string; icon: string; color: string; gradient: string }> = {
  programming: {
    label: "Programming",
    icon: "💻",
    color: "text-purple-400",
    gradient: "from-purple-500 to-pink-500",
  },
  sains: {
    label: "Sains",
    icon: "🔬",
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
  },
  matematika: {
    label: "Matematika",
    icon: "🧮",
    color: "text-green-400",
    gradient: "from-green-500 to-emerald-500",
  },
  fisika: {
    label: "Fisika",
    icon: "⚡",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
  },
  kimia: {
    label: "Kimia",
    icon: "🧪",
    color: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
  },
  ekonomi: {
    label: "Ekonomi",
    icon: "💰",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
  sejarah: {
    label: "Sejarah",
    icon: "🏛️",
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-500",
  },
  lainnya: {
    label: "Lainnya",
    icon: "📚",
    color: "text-slate-400",
    gradient: "from-slate-500 to-slate-600",
  },
};

export default function HomePage() {
  const visualizations = getAllConfigs();

  // Group visualizations by category
  const groupedByCategory = visualizations.reduce((acc, viz) => {
    const category = viz.kategori;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(viz);
    return acc;
  }, {} as Record<VisualizationCategory, typeof visualizations>);

  // Get categories that have visualizations, ordered by config order
  const activeCategories = (Object.keys(kategoriConfig) as VisualizationCategory[])
    .filter(cat => groupedByCategory[cat]?.length > 0);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visualisasi Konsep
            </span>
            <br />
            <span className="text-white">Interaktif</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-8">
            Pelajari berbagai konsep dengan animasi interaktif yang mudah dipahami.
            Dari programming hingga sains, semuanya divisualisasikan!
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            {activeCategories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${kategoriConfig[cat].gradient} text-white text-sm font-medium`}
              >
                {kategoriConfig[cat].icon} {kategoriConfig[cat].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <ProgressSummary totalVisualizations={visualizations.length} />
      </div>

      {/* Visualizations Grouped by Category */}
      <div className="container mx-auto px-4 py-12">
        {activeCategories.map((category) => (
          <section key={category} className="mb-12">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{kategoriConfig[category].icon}</span>
              <h2 className={`text-2xl font-bold ${kategoriConfig[category].color}`}>
                {kategoriConfig[category].label}
              </h2>
              <div className={`flex-1 h-px bg-gradient-to-r ${kategoriConfig[category].gradient} opacity-30`} />
              <span className="text-sm text-slate-500">
                {groupedByCategory[category].length} visualisasi
              </span>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByCategory[category].map((viz) => (
                <Link
                  key={viz.slug}
                  href={`/viz/${viz.slug}`}
                  className="group relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  {/* Progress Badge */}
                  <ProgressBadge slug={viz.slug} hasQuiz={(viz.quiz?.length ?? 0) > 0} />

                  {/* Icon */}
                  <div className="text-4xl mb-4">{viz.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {viz.judul}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4">
                    {viz.deskripsi}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1">
                      <span>📋</span>
                      <span>{viz.langkahLangkah.length} langkah</span>
                    </div>
                    {(viz.quiz?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🧠</span>
                        <span>{viz.quiz?.length} quiz</span>
                      </div>
                    )}
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-blue-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Coming Soon Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🚧</span>
            <h2 className="text-2xl font-bold text-slate-500">Coming Soon</h2>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(kategoriConfig) as VisualizationCategory[])
              .filter(cat => !groupedByCategory[cat] || groupedByCategory[cat].length === 0)
              .slice(0, 3)
              .map((category) => (
                <div
                  key={category}
                  className="relative bg-slate-800/30 backdrop-blur border border-dashed border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[180px]"
                >
                  <div className="text-4xl mb-3 opacity-50">{kategoriConfig[category].icon}</div>
                  <h3 className="text-lg font-medium text-slate-500 mb-1">
                    {kategoriConfig[category].label}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Segera hadir
                  </p>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Dibuat untuk membantu belajar berbagai konsep dengan cara yang lebih visual ✨</p>
          <p className="mt-2 text-xs text-slate-700">Debug: Loaded {visualizations.length} viz. Categories: {activeCategories.join(', ')}</p>
        </div>
      </footer>
    </main>
  );
}
