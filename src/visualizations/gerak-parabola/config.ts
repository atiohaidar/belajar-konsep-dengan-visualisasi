import { VisualizationConfig } from "../types";

export const config: VisualizationConfig = {
    slug: "gerak-parabola",
    judul: "Gerak Parabola (Projectile Motion)",
    deskripsi: "Simulasi gerak peluru dengan pengaturan kecepatan awal dan sudut elevasi. Pahami hubungan antara sudut, kecepatan, dan jarak tempuh.",
    kategori: "fisika",
    warna: "blue",
    icon: "🚀",
    langkahLangkah: [
        {
            id: "playground",
            judul: "Playground Gerak Parabola",
            penjelasan: "Eksperimen dengan mengubah kecepatan awal (v₀) dan sudut elevasi (θ). Perhatikan lintasan benda yang berbentuk parabola.",
            durasi: 0,
        },
    ],
    quiz: [
        {
            id: "q1",
            pertanyaan: "Pada gerak parabola, komponen kecepatan mana yang nilainya TETAP (konstan) selama benda bergerak di udara (abaikan gesekan udara)?",
            pilihan: [
                "Kecepatan arah vertikal (vy)",
                "Kecepatan arah horizontal (vx)",
                "Kecepatan total (v)",
                "Tidak ada yang konstan"
            ],
            jawabanBenar: 1,
            penjelasan: "Pada gerak parabola, tidak ada percepatan pada arah horizontal (ax = 0), sehingga kecepatan horizontal (vx) selalu konstan. Sedangkan arah vertikal dipengaruhi gravitasi."
        },
        {
            id: "q2",
            pertanyaan: "Sudut elevasi berapakah yang menghasilkan jarak jangkauan terjauh (maksimum) pada bidang datar?",
            pilihan: [
                "30 derajat",
                "60 derajat",
                "45 derajat",
                "90 derajat"
            ],
            jawabanBenar: 2,
            penjelasan: "Jarak terjauh dicapai pada sudut 45° karena nilai sin(2θ) mencapai maksimum (sin 90° = 1) pada rumus R = (v₀² sin 2θ) / g."
        },
        {
            id: "q3",
            pertanyaan: "Bagaimana kecepatan benda saat berada di titik TERTINGGI lintasan?",
            pilihan: [
                "Kecepatannya nol (diam sesaat)",
                "Kecepatannya sama dengan kecepatan awal",
                "Kecepatan vertikal (vy) nol, tapi masih punya kecepatan horizontal (vx)",
                "Kecepatan horizontal (vx) nol, tapi masih punya kecepatan vertikal (vy)"
            ],
            jawabanBenar: 2,
            penjelasan: "Di titik tertinggi, benda berhenti naik sejenak sehingga vy = 0. Namun, benda masih terus bergerak ke depan dengan kecepatan vx. Jadi kecepatan totalnya tidak nol."
        },
        {
            id: "gp-prac-1",
            type: "practice",
            case: "projectile-max-height",
            pertanyaan: "Sebuah peluru ditembakkan dengan kecepatan awal 20 m/s dan sudut elevasi 30°. Berapa tinggi maksimum yang dicapai? (g = 10 m/s²)",
            variables: { v0: 20, angle: 30, g: 10 },
            correctAnswer: 5,
            unit: "meter",
            penjelasan: "h_max = (v₀² sin²θ) / 2g = (400 * (0.5)²) / 20 = (400 * 0.25) / 20 = 100 / 20 = 5 meter."
        }
    ],
};
