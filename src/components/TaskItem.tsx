import clsx from 'clsx';
import { useTaskStore } from '../store/useTaskStore';
import type { TaskRow } from '../store/useTaskStore';

type TaskItemProps = TaskRow;

const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-red-100 text-red-700 border-red-200'
};

const statusIcons = {
    'pending': 'radio_button_unchecked',
    'in-progress': 'pending',
    'done': 'check_circle'
};

const statusColors = {
    'pending': 'text-slate-300 hover:text-primary-400',
    'in-progress': 'text-amber-500 hover:text-emerald-500 animate-pulse',
    'done': 'text-emerald-500 hover:text-slate-300'
};

export function TaskItem({ id, title, priority, status }: TaskItemProps) {
    const { updateTask, deleteTask } = useTaskStore();

    const toggleStatus = () => {
        const nextStatus =
            status === 'pending' ? 'in-progress' :
                status === 'in-progress' ? 'done' : 'pending';
        updateTask(id, { status: nextStatus });
    };

    return (
        <div className="group flex items-center justify-between p-4 my-1.5 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-primary-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={toggleStatus}
                    className={clsx(
                        "flex-shrink-0 transition-all duration-300 hover:scale-110",
                        statusColors[status as keyof typeof statusColors]
                    )}
                    aria-label={`Mark as ${status === 'pending' ? 'in-progress' : status === 'in-progress' ? 'done' : 'pending'}`}
                >
                    <span className="material-symbols-outlined text-[28px]">
                        {statusIcons[status as keyof typeof statusIcons]}
                    </span>
                </button>

                <div className="flex flex-col gap-1">
                    <span
                        className={clsx(
                            "text-main-dark font-medium transition-all duration-300",
                            status === 'done' && "text-slate-400 line-through decoration-slate-300"
                        )}
                    >
                        {title}
                    </span>
                    <span className={clsx(
                        "text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border w-fit",
                        priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium
                    )}>
                        {priority}
                    </span>
                </div>
            </div>

            <button
                onClick={() => deleteTask(id)}
                className="p-2 rounded-xl text-slate-300 group-hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 shrink-0 ml-4"
                aria-label="Delete Task"
            >
                <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </div>
    );
}
