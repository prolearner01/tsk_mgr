import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export type TaskRow = Database['public']['Tables']['tasks']['Row'];

interface TaskStore {
    tasks: TaskRow[];
    loading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    addTask: (title: string, priority: string, status?: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<TaskRow>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    clearTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ tasks: data as TaskRow[] });
        } catch (err: any) {
            set({ error: err.message });
            console.error('Error fetching tasks:', err);
        } finally {
            set({ loading: false });
        }
    },

    addTask: async (title, priority, status = 'pending') => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title, priority, status }])
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                tasks: [data as TaskRow, ...state.tasks]
            }));
        } catch (err: any) {
            console.error('Error adding task:', err);
        }
    },

    updateTask: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updates } : task
            ),
        }));

        try {
            const { error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id);

            if (error) {
                // Revert if error
                console.error('Error updating task:', error);
                get().fetchTasks();
            }
        } catch (err) {
            console.error('Unhandled error updating task:', err);
        }
    },

    deleteTask: async (id) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        }));

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting task:', error);
                get().fetchTasks();
            }
        } catch (err) {
            console.error('Unhandled error deleting task:', err);
        }
    },

    clearTasks: () => set({ tasks: [] })
}));
