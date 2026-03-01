import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen text-main-dark flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-animated-gradient font-sans transition-colors duration-500">
            {children}
        </div>
    );
}
