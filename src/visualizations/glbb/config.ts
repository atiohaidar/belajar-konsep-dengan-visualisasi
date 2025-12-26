import { VisualizationConfig } from "../types";

export const config: VisualizationConfig = {
    slug: "glbb",
    judul: "Gerak Lurus Berubah Beraturan (GLBB)",
    deskripsi: "Pelajari konsep GLBB dengan simulasi interaktif - ubah kecepatan dan percepatan, lihat hasilnya!",
    kategori: "fisika",
    warna: "orange",
    icon: "🚗",
    langkahLangkah: [
        {
            id: "playground",
            judul: "Playground GLBB",
            penjelasan: "Eksplorasi gerak GLBB secara bebas! Ubah kecepatan awal (v₀), percepatan (a), dan waktu (t) untuk melihat bagaimana mobil bergerak. Perhatikan perubahan grafik dan nilai real-time.",
            durasi: 0,
        },
    ],
    quiz: [
        {
            id: "q1",
            pertanyaan: "Sebuah mobil bergerak dengan kecepatan awal 10 m/s dan percepatan 2 m/s². Berapa kecepatan mobil setelah 5 detik?",
            pilihan: [
                "15 m/s",
                "20 m/s",
                "25 m/s",
                "12 m/s"
            ],
            jawabanBenar: 1,
            penjelasan: "Menggunakan rumus v = v₀ + a·t = 10 + (2)(5) = 10 + 10 = 20 m/s"
        },
        {
            id: "q2",
            pertanyaan: "Pada GLBB, jika percepatan bernilai negatif, apa yang terjadi pada benda?",
            pilihan: [
                "Benda bergerak mundur",
                "Benda berhenti seketika",
                "Kecepatan benda berkurang (perlambatan)",
                "Benda bergerak melingkar"
            ],
            jawabanBenar: 2,
            penjelasan: "Percepatan negatif berarti arah percepatan berlawanan dengan arah gerak, sehingga benda mengalami perlambatan (kecepatannya berkurang)."
        },
        {
            id: "q3",
            pertanyaan: "Rumus jarak tempuh pada GLBB adalah...",
            pilihan: [
                "s = v × t",
                "s = v₀·t + ½·a·t²",
                "s = a × t",
                "s = v₀ + a·t"
            ],
            jawabanBenar: 1,
            penjelasan: "Rumus jarak tempuh GLBB adalah s = v₀·t + ½·a·t², yang memperhitungkan kecepatan awal dan pengaruh percepatan terhadap jarak."
        },
        {
            id: "glbb-prac-1",
            type: "practice",
            case: "glbb-distance",
            pertanyaan: "Sebuah mobil bergerak dari keadaan diam dengan percepatan 2 m/s². Berapa jarak yang ditempuh setelah 5 detik?",
            variables: { v0: 0, a: 2, t: 5 },
            correctAnswer: 25,
            unit: "meter",
            penjelasan: "Menggunakan rumus s = v₀t + ½at²: s = 0(5) + ½(2)(5)² = 0 + 25 = 25 meter."
        },
        {
            id: "glbb-prac-2",
            type: "practice",
            case: "glbb-velocity",
            pertanyaan: "Sebuah benda bergerak dengan kecepatan awal 10 m/s dan dipercepat 3 m/s². Berapa kecepatannya setelah 4 detik?",
            variables: { v0: 10, a: 3, t: 4 },
            correctAnswer: 22,
            unit: "m/s",
            penjelasan: "Menggunakan rumus vt = v₀ + at: vt = 10 + (3)(4) = 10 + 12 = 22 m/s."
        }
    ],
};
