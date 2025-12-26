// Type definitions untuk semua visualisasi
// File ini adalah kontrak yang harus diikuti setiap visualisasi baru

import { ReactNode } from "react";

/**
 * Satu langkah dalam visualisasi
 */
export interface VisualizationStep {
    id: string;
    judul: string;           // Judul langkah (bahasa Indonesia)
    penjelasan: string;      // Penjelasan detail
    durasi?: number;         // Durasi animasi dalam ms (default: 1000)
}

/**
 * Pertanyaan quiz untuk menguji pemahaman
 */
export interface QuizQuestion {
    id: string;
    pertanyaan: string;      // Pertanyaan dalam bahasa Indonesia
    pilihan: string[];       // Opsi jawaban
    jawabanBenar: number;    // Index jawaban yang benar (0-based)
    penjelasan: string;      // Penjelasan mengapa jawaban tersebut benar
}

/**
 * Konfigurasi metadata visualisasi
 */
export interface VisualizationConfig {
    slug: string;            // URL slug (e.g., "http-request")
    judul: string;           // Judul tampilan
    deskripsi: string;       // Deskripsi singkat
    kategori: "network" | "security" | "storage" | "protocol";
    warna: string;           // Warna tema (Tailwind class)
    icon: string;            // Emoji atau icon
    langkahLangkah: VisualizationStep[];
    quiz?: QuizQuestion[];   // Optional quiz setelah visualisasi selesai
}

/**
 * Props untuk komponen visualisasi
 */
export interface VisualizationProps {
    langkahAktif: number;    // Index langkah yang sedang aktif
    sedangBerjalan: boolean; // Apakah animasi sedang berjalan
}

/**
 * Interface untuk setiap modul visualisasi
 */
export interface VisualizationModule {
    config: VisualizationConfig;
    Component: React.ComponentType<VisualizationProps>;
}

