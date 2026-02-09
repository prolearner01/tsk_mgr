import type { ReactNode } from 'react';

interface TaskDashboardProps {
    children: ReactNode;
}

export function TaskDashboard({ children }: TaskDashboardProps) {
    return (
        <div className="w-full max-w-[640px] bg-white rounded-card shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
            {children}
        </div>
    );
}
