// Centralized constants for the application
// This file contains magic strings and enums used throughout the codebase

/**
 * Quiz case types for practice questions
 */
export const QUIZ_CASES = {
    GLBB_DISTANCE: 'glbb-distance',
    GLBB_VELOCITY: 'glbb-velocity',
    PROJECTILE_MAX_HEIGHT: 'projectile-max-height',
    PROJECTILE_RANGE: 'projectile-range',
} as const;

export type QuizCaseType = typeof QUIZ_CASES[keyof typeof QUIZ_CASES];

/**
 * Visualization categories
 */
export const CATEGORIES = {
    PROGRAMMING: 'programming',
    SAINS: 'sains',
    MATEMATIKA: 'matematika',
    FISIKA: 'fisika',
    KIMIA: 'kimia',
    EKONOMI: 'ekonomi',
    SEJARAH: 'sejarah',
    LAINNYA: 'lainnya',
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATIONS = {
    DEFAULT_STEP: 2000,
    TRANSITION: 200,
    SWIPE_THRESHOLD: 50,
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
    PLAY_PAUSE: 'Space',
    NEXT: 'ArrowRight',
    PREV: 'ArrowLeft',
    RESET: 'KeyR',
    FULLSCREEN: 'KeyF',
    QUIZ: 'KeyQ',
    ESCAPE: 'Escape',
} as const;
