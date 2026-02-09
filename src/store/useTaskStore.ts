import { create } from 'zustand';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface TaskStore {
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [
        { id: '1', text: "Finalize quarterly earnings report", completed: false },
        { id: '2', text: "Review client contract updates", completed: false },
        { id: '3', text: "Departmental stand-up meeting", completed: false },
    ],
    addTask: (text) => set((state) => ({
        tasks: [...state.tasks, { id: crypto.randomUUID(), text, completed: false }]
    })),
    toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ),
    })),
    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
