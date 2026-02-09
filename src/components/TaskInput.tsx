import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export function TaskInput() {
    const [text, setText] = useState('');
    const { addTask } = useTaskStore();

    const handleAdd = () => {
        if (text.trim()) {
            addTask(text);
            setText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary-gray uppercase tracking-[0.1em]">
                    Create New Task
                </label>
                <input
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-corporate-blue/20 focus:border-corporate-blue outline-none transition-all placeholder:text-slate-400 text-main-dark"
                    placeholder="Enter task details..."
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                onClick={handleAdd}
                className="w-full bg-corporate-blue hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
                <span className="material-symbols-outlined">add</span>
                <span>Add Task</span>
            </button>
        </div>
    );
}
