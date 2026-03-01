import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';

export function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);
    const pendingCount = tasks.filter((t) => !t.completed).length;
    // In a real app we'd track "completed today", but for now we filter by completed.
    const completedCount = tasks.filter((t) => t.completed).length;
    const { signOut } = useAuthStore();

    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <div className="flex gap-4 text-sm text-secondary-gray">
                <span>{pendingCount} Tasks Pending</span>
                <span>{completedCount} Completed Today</span>
            </div>
            <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-main-dark hover:text-slate-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
