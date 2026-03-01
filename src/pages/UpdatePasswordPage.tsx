import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { supabase } from '../lib/supabase';

export function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    // Optionally check if we actually have a session/hash fragments indicating a reset flow,
    // but Supabase handles the session creation behind the scenes when the link is clicked.

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setMessage('Your password has been updated successfully. Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

    return (
        <AuthLayout title="Update password" subtitle="Enter your new password below.">
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-100">
                        {message}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-semibold text-secondary-gray mb-1">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 shadow-inner focus:bg-white"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || Boolean(message)}
                    className="mt-4 w-full btn-gradient font-bold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {loading ? 'Updating...' : 'Update password'}
                </button>
            </form>
        </AuthLayout>
    );
}
