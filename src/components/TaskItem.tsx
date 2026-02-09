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
        <div className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200">
            <label className="flex items-center gap-4 flex-1 cursor-pointer">
                <input
                    className="h-5 w-5 rounded border-slate-300 text-corporate-blue focus:ring-corporate-blue transition-all cursor-pointer"
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleTask(id)}
                />
                <span
                    className={clsx(
                        "text-main-dark font-medium transition-colors",
                        completed && "text-gray-400 line-through"
                    )}
                >
                    {text}
                </span>
            </label>
            <button
                onClick={() => deleteTask(id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
            </button>
        </div>
    );
}
