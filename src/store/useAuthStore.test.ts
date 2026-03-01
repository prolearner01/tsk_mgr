
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
            signOut: vi.fn(),
        },
    },
}));

describe('useAuthStore', () => {
    beforeEach(() => {
        useAuthStore.setState({ session: null, user: null, loading: true });
        vi.clearAllMocks();
    });

    it('initializes with session if present', async () => {
        const mockSession = { user: { id: '1', email: 'test@example.com' } };
        (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession }, error: null });
        (supabase.auth.onAuthStateChange as any).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

        await useAuthStore.getState().initialize();

        expect(useAuthStore.getState().session).toEqual(mockSession);
        expect(useAuthStore.getState().user).toEqual(mockSession.user);
        expect(useAuthStore.getState().loading).toBe(false);
    });

    it('handles sign out', async () => {
        await useAuthStore.getState().signOut();

        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(useAuthStore.getState().session).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });
});
