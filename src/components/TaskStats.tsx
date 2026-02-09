import { useTaskStore } from '../store/useTaskStore';

export function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);
    const pendingCount = tasks.filter((t) => !t.completed).length;
    // In a real app we'd track "completed today", but for now we filter by completed.
    const completedCount = tasks.filter((t) => t.completed).length;

    return (
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
            <div className="flex gap-8 text-[11px] font-bold text-secondary-gray uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-corporate-blue"></span>
                    {pendingCount} Tasks Pending
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {completedCount} Completed Today
                </div>
            </div>
            <button className="flex items-center justify-center gap-2 px-8 py-2.5 border border-slate-200 hover:bg-slate-50 text-secondary-gray text-xs font-bold uppercase tracking-widest rounded-full transition-all">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Logout</span>
            </button>
        </div>
    );
}
