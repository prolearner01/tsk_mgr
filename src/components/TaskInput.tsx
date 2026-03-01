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
        <div className="px-8 pb-6">
            <form
                onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
                className="relative flex items-center bg-white/60 border border-slate-200/60 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-400 focus-within:bg-white transition-all group"
            >
                <div className="pl-5 pr-2 w-full">
                    <input
                        className="w-full bg-transparent py-4 outline-none placeholder:text-slate-400 text-main-dark text-sm font-medium"
                        placeholder="What needs to be done?"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="pr-2 shrink-0">
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="p-2.5 rounded-xl btn-gradient disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
