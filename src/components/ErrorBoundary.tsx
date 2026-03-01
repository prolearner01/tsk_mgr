
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 border border-red-200 rounded-lg m-4">
                    <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                    <pre className="font-mono text-sm overflow-auto p-4 bg-white rounded border border-red-100">
                        {this.state.error?.toString()}
                    </pre>
                    <p className="mt-4 text-sm">Check the console for more details.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
