import { useState } from 'react';
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
    const { updateTask, deleteTask, subtasks, generateSubtasks, updateSubtask, deleteSubtask } = useTaskStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const taskSubtasks = subtasks.filter(st => st.task_id === id);

    const toggleStatus = () => {
        const nextStatus =
            status === 'pending' ? 'in-progress' :
                status === 'in-progress' ? 'done' : 'pending';
        updateTask(id, { status: nextStatus });
    };

    const handleGenerateSubtasks = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (taskSubtasks.length > 0) {
            setIsExpanded(!isExpanded);
            return;
        }
        setIsGenerating(true);
        try {
            await generateSubtasks(id, title);
            setIsExpanded(true);
        } catch (err) {
            console.error("Failed to generate subtasks", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col my-1.5 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-primary-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="group flex items-center justify-between p-4">
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
                        <div className="flex items-center gap-2">
                            <span className={clsx(
                                "text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border w-fit",
                                priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium
                            )}>
                                {priority}
                            </span>
                            {taskSubtasks.length > 0 && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {taskSubtasks.filter(st => st.completed).length}/{taskSubtasks.length} Subtasks
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center ml-4 gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 focus-within:opacity-100 shrink-0">
                    <button
                        onClick={handleGenerateSubtasks}
                        disabled={isGenerating}
                        className={clsx(
                            "p-2 rounded-xl transition-all duration-300",
                            isGenerating ? "text-primary-500 bg-primary-50 cursor-wait" :
                                taskSubtasks.length > 0 ? "text-primary-600 bg-primary-50 hover:bg-primary-100" :
                                    "text-slate-400 hover:text-primary-500 hover:bg-primary-50"
                        )}
                        title={taskSubtasks.length > 0 ? "Toggle Subtasks" : "Generate AI Subtasks"}
                    >
                        {isGenerating ? (
                            <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">
                                {taskSubtasks.length > 0 ? (isExpanded ? 'expand_less' : 'expand_more') : 'auto_awesome'}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => deleteTask(id)}
                        className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                        aria-label="Delete Task"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>

            {/* Subtasks Section */}
            {isExpanded && taskSubtasks.length > 0 && (
                <div className="px-14 pb-4 pt-1 flex flex-col gap-2 border-t border-slate-100/50 bg-slate-50/30">
                    {taskSubtasks.map(st => (
                        <div key={st.id} className="flex items-center justify-between group/subtask transition-all hover:bg-white/50 p-1.5 -mx-1.5 rounded-lg border border-transparent hover:border-slate-200 shadow-sm">
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={(e) => updateSubtask(st.id, { completed: e.target.checked })}
                                        className="peer appearance-none w-4 h-4 border-2 border-slate-300 rounded-md checked:bg-primary-500 checked:border-primary-500 transition-colors cursor-pointer"
                                    />
                                    <span className="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none">
                                        check
                                    </span>
                                </div>
                                <span className={clsx(
                                    "text-sm transition-all",
                                    st.completed ? "text-slate-400 line-through" : "text-slate-600 font-medium"
                                )}>
                                    {st.title}
                                </span>
                            </label>
                            <button
                                onClick={() => deleteSubtask(st.id)}
                                className="p-1 rounded opacity-0 group-hover/subtask:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all ml-2 shrink-0"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
