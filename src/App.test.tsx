import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTaskStore } from './store/useTaskStore';
import { useAuthStore } from './store/useAuthStore';

// Mock Supabase to avoid real network calls
vi.mock('./lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
        },
    },
}));

// Mock Auth Store to simulate logged in state
vi.mock('./store/useAuthStore', () => ({
    useAuthStore: vi.fn(),
}));

// Mock the initial state for consistent testing
const initialStoreState = useTaskStore.getState();

describe('Task Manager', () => {
    beforeEach(() => {
        // Reset store before each test
        useTaskStore.setState(initialStoreState, true);
        // Default to authenticated
        (useAuthStore as any).mockReturnValue({
            session: { user: { id: '1' } },
            loading: false,
            initialize: vi.fn(),
        });
    });

    it('renders the dashboard with initial tasks', () => {
        render(<App />);

        expect(screen.getByText('Task Manager')).toBeInTheDocument();
        expect(screen.getByText('Finalize quarterly earnings report')).toBeInTheDocument();
    });

    it('can add a new task', () => {
        render(<App />);

        const input = screen.getByPlaceholderText('Enter task details...');
        const addButton = screen.getByText('Add Task');

        fireEvent.change(input, { target: { value: 'New Test Task' } });
        fireEvent.click(addButton);

        expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });

    it('can toggle a task completion status', () => {
        render(<App />);

        const taskText = screen.getByText('Finalize quarterly earnings report');
        // Find the checkbox associated with this task. 
        // The structure is <label><input /><span /></label> so we can find by label text or just assume input is near.
        // Easier approach: Get the checkbox by role within the list item.
        // But since we didn't add aria-labels or specific logic, let's rely on the label text relation if possible, 
        // or just find the input in the document that corresponds to it.

        // In our component: <label> <input type="checkbox" /> <span>Text</span> </label>
        // So distinct testing library query:
        const checkbox = screen.getAllByRole('checkbox')[0];

        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();
    });

    it('can delete a task', () => {
        render(<App />);

        const taskText = 'Review client contract updates';
        expect(screen.getByText(taskText)).toBeInTheDocument();

        // Find the delete button for this task. 
        // This is tricky without unique IDs per row for testing. 
        // We'll just grab the second delete button (index 1) which corresponds to the second task.
        // NOTE: Buttons are hidden by opacity but present in DOM.
        const deleteButtons = screen.getAllByText('delete'); // Material symbol text
        const deleteBtn = deleteButtons[1].closest('button');

        if (deleteBtn) {
            fireEvent.click(deleteBtn);
        }

        expect(screen.queryByText(taskText)).not.toBeInTheDocument();
    });
});
