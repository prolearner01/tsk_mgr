import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import type { TaskRow } from '../store/useTaskStore';

interface SearchResult extends TaskRow {
    similarity: number;
}

export function SmartSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            // Re-fetch token due to RLS
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            
            // We use the anon key in headers if that was the setup, 
            // but for smart search we'll just try invoking it properly with the anonKey explicitly like we did before
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            
            const { data, error } = await supabase.functions.invoke('smart-search', {
                body: { query },
                 // Also passing the JWT if the edge function checks it, 
                 // but using Anon key in Authorization header if needed.
                 // Actually the Edge Function expects the User JWT to enforce RLS via the `authHeader`.
                headers: { Authorization: `Bearer ${token}` }
            });

            if (error) {
                // If it fails with token, fallback to explicit anon key if the setup uses it
                if (error.message.includes('401') || error.message.includes('Invalid JWT')) {
                    const fallbackRes = await supabase.functions.invoke('smart-search', {
                        body: { query },
                        headers: { Authorization: `Bearer ${anonKey}` }
                    });
                    if (fallbackRes.error) throw fallbackRes.error;
                    if (fallbackRes.data?.tasks) setResults(fallbackRes.data.tasks);
                    return;
                }
                throw error;
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            if (data?.tasks) {
                setResults(data.tasks);
            }
        } catch (err: any) {
            console.error('Smart Search error:', err);
            setError(err.message || 'An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[680px] bg-blue-50 border border-blue-100/50 shadow-sm rounded-2xl overflow-hidden mb-6 p-4 md:p-6 transition-all animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Smart Search</h2>
            </div>
            
            <form onSubmit={handleSearch} className="relative flex items-center mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by meaning (e.g., 'Groceries', 'Urgent work')..."
                    className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block pl-10 p-3 transition-colors placeholder:text-slate-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium text-xs rounded-lg px-4 py-1.5 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
                </button>
            </form>

            {error && (
                <div className="flex items-start gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Top Results</h3>
                    {results.map((task) => (
                        <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm gap-3">
                            <div>
                                <h4 className="font-medium text-slate-800 text-sm">{task.title}</h4>
                                <div className="flex gap-2 mt-1.5 opacity-80">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {task.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                                    Match: {Math.round(task.similarity * 100)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {results.length === 0 && !loading && !error && query && (
               <div className="text-center py-6 text-sm text-slate-500">
                   No relevant tasks found for "{query}". Try a different term.
               </div>
            )}
        </div>
    );
}
