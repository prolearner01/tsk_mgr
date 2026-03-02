import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);

    const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
    const completedCount = tasks.filter((t) => t.status === 'done').length;

    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex justify-between items-center mt-6 px-8 py-5 bg-slate-50/50 border-t border-slate-100">
            <div className="flex gap-6 text-[11px] font-bold uppercase tracking-wider text-secondary-gray overflow-x-auto">
                <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></span> {pendingCount} Pending</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> {inProgressCount} In Progress</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-emerald-400 border border-emerald-500/20"></span> {completedCount} Done</span>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors"
            >
                Logout
                <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
        </div>
    );
}
