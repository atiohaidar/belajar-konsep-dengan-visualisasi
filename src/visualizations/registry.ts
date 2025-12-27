// Registry: Daftar semua visualisasi yang tersedia
// Untuk menambah visualisasi baru, import dan tambahkan ke array di bawah

import { lazy, ComponentType } from "react";
import { VisualizationModule, VisualizationProps, VisualizationConfig } from "./types";
import * as httpRequest from "./http-request";
import * as websocket from "./websocket";
import * as glbb from "./glbb";
import * as gerakParabola from "./gerak-parabola";

// Daftar semua visualisasi
// Tambahkan visualisasi baru di sini - Force refresh
export const visualizations: VisualizationModule[] = [
    {
        config: httpRequest.config,
        Component: httpRequest.Component,
    },
    {
        config: websocket.config,
        Component: websocket.Component,
    },
    {
        config: glbb.config,
        Component: glbb.Component,
    },
    {
        config: gerakParabola.config,
        Component: gerakParabola.Component,
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

// Helper: Get all slugs for static generation
export function getAllSlugs(): string[] {
    return visualizations.map((v) => v.config.slug);
}

// Lazy loading map for dynamic imports
const lazyComponents: Record<string, ComponentType<VisualizationProps>> = {};

/**
 * Get a lazy-loaded visualization component
 * Uses dynamic import for code splitting
 */
export function getLazyComponent(slug: string): ComponentType<VisualizationProps> | null {
    // Return cached lazy component if exists
    if (lazyComponents[slug]) {
        return lazyComponents[slug];
    }

    // Create lazy component based on slug
    const LazyComponent = lazy(async () => {
        switch (slug) {
            case "http-request":
                return import("./http-request").then(m => ({ default: m.Component }));
            case "websocket":
                return import("./websocket").then(m => ({ default: m.Component }));
            case "glbb":
                return import("./glbb").then(m => ({ default: m.Component }));
            case "gerak-parabola":
                return import("./gerak-parabola").then(m => ({ default: m.Component }));
            default:
                throw new Error(`Visualization "${slug}" not found`);
        }
    });

    lazyComponents[slug] = LazyComponent;
    return LazyComponent;
}

/**
 * Get config by slug (sync, for metadata)
 */
export function getConfigBySlug(slug: string): VisualizationConfig | undefined {
    return visualizations.find(v => v.config.slug === slug)?.config;
}
