import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { supabase } from '../lib/supabase';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // Redirect back to the update password page after clicking the email link
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset instructions have been sent to your email.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Reset password" subtitle="Enter your email to receive a reset link.">
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
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
                    <label className="block text-xs font-semibold text-secondary-gray mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 shadow-inner focus:bg-white"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || Boolean(message)} // Disable after success
                    className="mt-4 w-full btn-gradient font-bold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {loading ? 'Sending link...' : 'Send reset link'}
                </button>

                <div className="text-center text-xs text-secondary-gray mt-4">
                    Remember your password?{' '}
                    <Link to="/login" className="text-main-dark font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
