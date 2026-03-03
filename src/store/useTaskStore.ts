import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export type TaskRow = Database['public']['Tables']['tasks']['Row'];
export type SubtaskRow = Database['public']['Tables']['subtasks']['Row'];

interface TaskStore {
    tasks: TaskRow[];
    subtasks: SubtaskRow[];
    loading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    addTask: (title: string, priority: string, status?: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<TaskRow>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    clearTasks: () => void;
    addSubtask: (taskId: string, title: string) => Promise<void>;
    updateSubtask: (id: string, updates: Partial<SubtaskRow>) => Promise<void>;
    deleteSubtask: (id: string) => Promise<void>;
    generateSubtasks: (taskId: string, title: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    subtasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const [tasksRes, subtasksRes] = await Promise.all([
                supabase.from('tasks').select('*').order('created_at', { ascending: false }),
                supabase.from('subtasks').select('*').order('created_at', { ascending: true })
            ]);

            if (tasksRes.error) throw tasksRes.error;
            if (subtasksRes.error) throw subtasksRes.error;

            set({
                tasks: tasksRes.data as TaskRow[],
                subtasks: subtasksRes.data as SubtaskRow[]
            });
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

    clearTasks: () => set({ tasks: [], subtasks: [] }),

    addSubtask: async (taskId, title) => {
        try {
            const { data, error } = await supabase
                .from('subtasks')
                .insert([{ task_id: taskId, title }])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({ subtasks: [...state.subtasks, data as SubtaskRow] }));
        } catch (err) {
            console.error('Error adding subtask:', err);
        }
    },

    updateSubtask: async (id, updates) => {
        set((state) => ({
            subtasks: state.subtasks.map((st) => st.id === id ? { ...st, ...updates } : st),
        }));
        try {
            const { error } = await supabase.from('subtasks').update(updates).eq('id', id);
            if (error) {
                console.error('Error updating subtask:', error);
                get().fetchTasks();
            }
        } catch (err) {
            console.error('Error updating subtask:', err);
        }
    },

    deleteSubtask: async (id) => {
        set((state) => ({
            subtasks: state.subtasks.filter((st) => st.id !== id),
        }));
        try {
            const { error } = await supabase.from('subtasks').delete().eq('id', id);
            if (error) {
                console.error('Error deleting subtask:', error);
                get().fetchTasks();
            }
        } catch (err) {
            console.error('Error deleting subtask:', err);
        }
    },

    generateSubtasks: async (taskId, title) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;

            const { data, error } = await supabase.functions.invoke('generate-subtasks', {
                body: { taskId, title },
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            if (error) throw error;

            if (data && data.subtasks && Array.isArray(data.subtasks) && data.subtasks.length > 0) {
                const inserts = data.subtasks.map((st: string) => ({
                    task_id: taskId,
                    title: st
                }));

                const { data: insertedData, error: insertError } = await supabase
                    .from('subtasks')
                    .insert(inserts)
                    .select();

                if (insertError) throw insertError;

                if (insertedData) {
                    set((state) => ({ subtasks: [...state.subtasks, ...(insertedData as SubtaskRow[])] }));
                }
            } else if (data && data.error) {
                throw new Error(data.error);
            }
        } catch (err) {
            console.error('Error generating subtasks:', err);
            throw err;
        }
    }
}));
