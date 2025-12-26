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
export interface BaseQuestion {
    id: string;
    pertanyaan: string;
    penjelasan: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type?: 'multiple-choice'; // Optional for backward compatibility
    pilihan: string[];
    jawabanBenar: number;
}

export interface PracticeQuestion extends BaseQuestion {
    type: 'practice';
    case: 'glbb-distance' | 'glbb-velocity';
    variables: { [key: string]: number }; // e.g., { v0: 10, a: 2, t: 5 }
    correctAnswer: number;
    unit: string;
    tolerance?: number; // Allow small margin of error (default 0.1)
}

export type QuizQuestion = MultipleChoiceQuestion | PracticeQuestion;

/**
 * Konfigurasi metadata visualisasi
 */
export type VisualizationCategory =
    | "programming"   // HTTP, WebSocket, REST API, Database
    | "sains"         // DNA, Atom, Tata Surya, Fotosintesis
    | "matematika"    // Algoritma, Graph, Sorting
    | "fisika"        // Listrik, Gelombang, Mekanika
    | "kimia"         // Reaksi kimia, Molekul
    | "ekonomi"       // Supply-demand, Inflasi
    | "sejarah"       // Timeline, Peradaban
    | "lainnya";      // Kategori umum

export interface VisualizationConfig {
    slug: string;            // URL slug (e.g., "http-request")
    judul: string;           // Judul tampilan
    deskripsi: string;       // Deskripsi singkat
    kategori: VisualizationCategory;
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

