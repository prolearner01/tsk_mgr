import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen text-main-dark flex flex-col items-center justify-center py-12 px-6 bg-bg-page font-sans">
            {children}
        </div>
    );
}
