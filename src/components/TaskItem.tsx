import clsx from 'clsx';
import { useTaskStore } from '../store/useTaskStore';

interface TaskItemProps {
    id: string;
    text: string;
    completed: boolean;
}

export function TaskItem({ id, text, completed }: TaskItemProps) {
    const { toggleTask, deleteTask } = useTaskStore();

    return (
        <div className="group flex items-center justify-between p-4 my-1.5 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-primary-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <label className="flex items-center gap-4 flex-1 cursor-pointer relative">
                <div className={clsx(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    completed ? "bg-primary-500 border-primary-500 shadow-inner" : "bg-white border-slate-300 group-hover:border-primary-400"
                )}>
                    {completed && <span className="material-symbols-outlined text-white text-[16px] animate-slide-up">check</span>}
                </div>
                {/* Hidden actual checkbox for accessibility */}
                <input
                    className="sr-only"
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleTask(id)}
                />
                <span
                    className={clsx(
                        "text-main-dark font-medium transition-all duration-300",
                        completed && "text-slate-400 line-through decoration-slate-300"
                    )}
                >
                    {text}
                </span>
            </label>
            <button
                onClick={() => deleteTask(id)}
                className="p-2 rounded-xl text-slate-300 group-hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
                aria-label="Delete Task"
            >
                <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </div>
    );
}
