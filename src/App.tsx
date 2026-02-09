import { Layout } from './components/Layout';
import { TaskDashboard } from './components/TaskDashboard';
import { TaskHeader } from './components/TaskHeader';
import { TaskItem } from './components/TaskItem';
import { TaskInput } from './components/TaskInput';
import { TaskStats } from './components/TaskStats';
import { useTaskStore } from './store/useTaskStore';

function App() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <Layout>
      <TaskDashboard>
        <TaskHeader />

        <div className="p-8">
          <div className="space-y-1 mb-10">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                text={task.text}
                completed={task.completed}
              />
            ))}
          </div>

          <TaskInput />

          <TaskStats />
        </div>
      </TaskDashboard>
    </Layout>
  );
}

export default App;
