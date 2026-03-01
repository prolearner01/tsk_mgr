
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center px-4 font-sans text-main-dark">
            <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-main-dark mb-2">{title}</h1>
                    <p className="text-sm text-secondary-gray">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
}
