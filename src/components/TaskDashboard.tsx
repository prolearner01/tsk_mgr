
// Removed unused import
import { useTaskStore } from '../store/useTaskStore';
import { TaskHeader } from './TaskHeader';
import { TaskInput } from './TaskInput';
import { TaskItem } from './TaskItem';
import { TaskStats } from './TaskStats';
import { UserProfile } from './UserProfile';

export function TaskDashboard() {
    const tasks = useTaskStore((state) => state.tasks);

    return (
        <>
            <UserProfile />
            <div className="w-full max-w-[680px] glass-panel-heavy rounded-3xl overflow-hidden animate-slide-up">
                <TaskHeader />
                <TaskInput />
                <div className="flex flex-col">
                    {tasks.length === 0 ? (
                        <div className="p-8 text-center text-secondary-gray text-sm">
                            No tasks yet. Add one above!
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem key={task.id} {...task} />
                        ))
                    )}
                </div>
                <TaskStats />
            </div>
        </>
    );
}
