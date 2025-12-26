import Link from "next/link";
import { getAllConfigs } from "@/visualizations/registry";

const kategoriColors = {
  network: "from-blue-500 to-cyan-500",
  security: "from-red-500 to-orange-500",
  storage: "from-green-500 to-emerald-500",
  protocol: "from-purple-500 to-pink-500",
};

const kategoriLabels = {
  network: "Jaringan",
  security: "Keamanan",
  storage: "Penyimpanan",
  protocol: "Protokol",
};

export default function HomePage() {
  const visualizations = getAllConfigs();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visualisasi Konsep
            </span>
            <br />
            <span className="text-white">Programming</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-8">
            Pelajari konsep-konsep programming dengan animasi interaktif yang mudah dipahami.
            Dari HTTP Request hingga WebSocket, semuanya divisualisasikan!
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(kategoriLabels).map(([key, label]) => (
              <span
                key={key}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${kategoriColors[key as keyof typeof kategoriColors]} text-white text-sm font-medium`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          📚 Daftar Visualisasi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualizations.map((viz) => (
            <Link
              key={viz.slug}
              href={`/viz/${viz.slug}`}
              className="group relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              {/* Kategori badge */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${kategoriColors[viz.kategori]} text-white`}>
                {kategoriLabels[viz.kategori]}
              </div>

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

              {/* Steps count */}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span>📋</span>
                <span>{viz.langkahLangkah.length} langkah</span>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-400">→</span>
              </div>
            </Link>
          ))}

          {/* Coming Soon Card */}
          <div className="relative bg-slate-800/30 backdrop-blur border border-dashed border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-medium text-slate-500 mb-2">
              Coming Soon
            </h3>
            <p className="text-slate-600 text-sm">
              Visualisasi lainnya sedang dalam pengembangan
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Dibuat untuk membantu belajar konsep programming dengan cara yang lebih visual</p>
        </div>
      </footer>
    </main>
  );
}
