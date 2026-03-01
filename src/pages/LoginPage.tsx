
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { supabase } from '../lib/supabase';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Auth state change will be picked up by store, but navigate ensures immediate feedback
            navigate('/');
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Please enter your details to sign in.">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 shadow-inner focus:bg-white"
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
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 shadow-inner focus:bg-white"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full btn-gradient font-bold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="flex flex-col items-center gap-2 mt-4 text-xs text-secondary-gray">
                    <div>
                        <Link to="/forgot-password" className="text-corporate-blue font-semibold hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-main-dark font-semibold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
