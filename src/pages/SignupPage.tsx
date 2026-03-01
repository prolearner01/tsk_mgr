
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { supabase } from '../lib/supabase';

export function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Supabase may require email verification. For now assuming auto-login or redirect.
            // If email confirmation is enabled, user won't be logged in yet.
            // We'll redirect to login with a message or to dashboard if session created.
            navigate('/');
        }
    };

    return (
        <AuthLayout title="Create account" subtitle="Start managing your tasks effectively.">
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-semibold text-secondary-gray mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-dark/10 focus:border-main-dark transition-colors"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-secondary-gray mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-dark/10 focus:border-main-dark transition-colors"
                        placeholder="Create a password"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-main-dark text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating account...' : 'Sign up'}
                </button>

                <div className="text-center text-xs text-secondary-gray mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-main-dark font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
