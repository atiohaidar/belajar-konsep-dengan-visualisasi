// Registry: Daftar semua visualisasi yang tersedia
// Untuk menambah visualisasi baru:
// 1. Tambahkan entry ke VISUALIZATION_MODULES di bawah
// 2. Import akan otomatis di-handle oleh getLazyComponent

import { lazy, ComponentType } from "react";
import { VisualizationModule, VisualizationProps, VisualizationConfig } from "./types";
import * as httpRequest from "./http-request";
import * as websocket from "./websocket";
import * as glbb from "./glbb";
import * as gerakParabola from "./gerak-parabola";

/**
 * Centralized visualization module registry
 * Add new visualizations here - this is the SINGLE source of truth
 */
const VISUALIZATION_MODULES = {
    "http-request": httpRequest,
    "websocket": websocket,
    "glbb": glbb,
    "gerak-parabola": gerakParabola,
} as const;

type VisualizationSlug = keyof typeof VISUALIZATION_MODULES;

// Build visualizations array from the centralized registry
export const visualizations: VisualizationModule[] = Object.values(VISUALIZATION_MODULES).map(
    (module) => ({
        config: module.config,
        Component: module.Component,
    })
);

// Helper: Cari visualisasi berdasarkan slug
export function getVisualizationBySlug(slug: string): VisualizationModule | undefined {
    const module = VISUALIZATION_MODULES[slug as VisualizationSlug];
    if (!module) return undefined;
    return {
        config: module.config,
        Component: module.Component,
    };
}

// Helper: Dapatkan semua config untuk listing
export function getAllConfigs(): VisualizationConfig[] {
    return visualizations.map((v) => v.config);
}

// Helper: Get all slugs for static generation
export function getAllSlugs(): string[] {
    return Object.keys(VISUALIZATION_MODULES);
}

// Lazy loading cache
const lazyComponentsCache: Record<string, ComponentType<VisualizationProps>> = {};

/**
 * Dynamic import factory - generates import function based on slug
 * This eliminates the need for manual switch statement
 */
function createLazyImport(slug: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importMap: Record<string, () => Promise<any>> = {
        "http-request": () => import("./http-request"),
        "websocket": () => import("./websocket"),
        "glbb": () => import("./glbb"),
        "gerak-parabola": () => import("./gerak-parabola"),
    };

    const importFn = importMap[slug];
    if (!importFn) {
        throw new Error(`Visualization "${slug}" not found`);
    }

    return importFn().then((m) => ({ default: m.Component }));
}

/**
 * Get a lazy-loaded visualization component
 * Uses dynamic import for code splitting
 */
export function getLazyComponent(slug: string): ComponentType<VisualizationProps> | null {
    // Validate slug exists
    if (!(slug in VISUALIZATION_MODULES)) {
        return null;
    }

    // Return cached lazy component if exists
    if (lazyComponentsCache[slug]) {
        return lazyComponentsCache[slug];
    }

    // Create and cache lazy component
    const LazyComponent = lazy(() => createLazyImport(slug));
    lazyComponentsCache[slug] = LazyComponent;
    return LazyComponent;
}

/**
 * Get config by slug (sync, for metadata)
 */
export function getConfigBySlug(slug: string): VisualizationConfig | undefined {
    const module = VISUALIZATION_MODULES[slug as VisualizationSlug];
    return module?.config;
}

/**
 * Check if a slug is valid
 */
export function isValidSlug(slug: string): slug is VisualizationSlug {
    return slug in VISUALIZATION_MODULES;
}
