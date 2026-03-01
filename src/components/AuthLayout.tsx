
// Removed unused import

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-4 font-sans text-main-dark transition-colors duration-500">
            <div className="w-full max-w-[420px] glass-panel-heavy rounded-3xl p-10 animate-slide-up">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white mb-6 shadow-lg shadow-primary-500/30">
                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-main-dark mb-2">{title}</h1>
                    <p className="text-sm font-medium text-secondary-gray">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
}
