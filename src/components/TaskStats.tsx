import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);
    const pendingCount = tasks.filter((t) => !t.completed).length;
    // In a real app we'd track "completed today", but for now we filter by completed.
    const completedCount = tasks.filter((t) => t.completed).length;
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex justify-between items-center mt-6 px-8 py-5 bg-slate-50/50 border-t border-slate-100">
            <div className="flex gap-6 text-[11px] font-bold uppercase tracking-wider text-secondary-gray">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> {pendingCount} Pending</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 border border-emerald-500/20"></span> {completedCount} Done</span>
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
