"use client";

import React, { Component, ReactNode } from "react";
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component for catching and handling render errors gracefully
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorInfo });

        // Log error for debugging
        console.error("ErrorBoundary caught an error:", error);
        console.error("Component stack:", errorInfo.componentStack);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-slate-800/50 backdrop-blur border border-red-500/30 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-2">
                        Oops! Terjadi Kesalahan
                    </h2>

                    <p className="text-slate-400 text-center mb-6 max-w-md">
                        Terjadi kesalahan saat menampilkan konten ini.
                        Silakan coba lagi atau muat ulang halaman.
                    </p>

                    {/* Error details (development only) */}
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <details className="mb-6 w-full max-w-md">
                            <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                                Detail Error (Dev Only)
                            </summary>
                            <pre className="mt-2 p-3 bg-slate-900 rounded text-xs text-red-400 overflow-auto max-h-40">
                                {this.state.error.message}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Coba Lagi
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
