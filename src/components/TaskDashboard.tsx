
import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskHeader } from './TaskHeader';
import { TaskInput } from './TaskInput';
import { TaskItem } from './TaskItem';
import { TaskStats } from './TaskStats';

export function TaskDashboard() {
    const tasks = useTaskStore((state) => state.tasks);

    return (
        <div className="w-full max-w-[640px] bg-white rounded-card shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
            <TaskHeader />
            <TaskInput />
            <div className="flex flex-col">
                {tasks.length === 0 ? (
                    <div className="p-8 text-center text-secondary-gray text-sm">
                        No tasks yet. Add one above!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskItem key={task.id} id={task.id} text={task.text} completed={task.completed} />
                    ))
                )}
            </div>
            <TaskStats />
        </div>
    );
}
