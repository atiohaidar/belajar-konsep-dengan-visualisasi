// Registry: Daftar semua visualisasi yang tersedia
// Untuk menambah visualisasi baru, import dan tambahkan ke array di bawah

import { VisualizationModule } from "./types";
import * as httpRequest from "./http-request";
import * as websocket from "./websocket";

// Daftar semua visualisasi
// Tambahkan visualisasi baru di sini
export const visualizations: VisualizationModule[] = [
    {
        config: httpRequest.config,
        Component: httpRequest.Component,
    },
    {
        config: websocket.config,
        Component: websocket.Component,
    },
];

// Helper: Cari visualisasi berdasarkan slug
export function getVisualizationBySlug(slug: string): VisualizationModule | undefined {
    return visualizations.find((v) => v.config.slug === slug);
}

// Helper: Dapatkan semua config untuk listing
export function getAllConfigs() {
    return visualizations.map((v) => v.config);
}
