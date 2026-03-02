import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export function TaskInput() {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('medium');
    const { addTask } = useTaskStore();

    const handleAdd = () => {
        if (text.trim()) {
            addTask(text, priority);
            setText('');
            setPriority('medium');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="px-8 pb-6">
            <form
                onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
                className="relative-flex items-center bg-white/60 border border-slate-200/60 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-400 focus-within:bg-white transition-all group overflow-hidden flex"
            >
                <div className="pl-5 pr-2 w-full">
                    <input
                        className="w-full bg-transparent py-4 outline-none placeholder:text-slate-400 text-main-dark text-sm font-medium"
                        placeholder="What needs to be done?"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="flex items-center gap-2 pr-2 shrink-0 border-l border-slate-200/60 pl-3">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none text-slate-500 cursor-pointer appearance-none px-2"
                        title="Set Priority"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Mod</option>
                        <option value="high">High</option>
                    </select>

                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="p-2.5 rounded-xl btn-gradient disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center transition-opacity"
                    >
                        <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
