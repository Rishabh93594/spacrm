import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password);

        if (success) {
            navigate('/');
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50/50 flex items-center justify-center p-4">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-luxury border border-stone-100 overflow-hidden animate-gentle-fade">
                    {/* Header with rose gold accent */}
                    <div className="relative p-8 border-b border-stone-100 bg-stone-50/30">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"></div>

                        <div className="flex flex-col items-center gap-4">
                            <img
                                src="/lgo.png"
                                alt="Forever Young NYC Logo"
                                className="h-16 w-auto object-contain"
                            />
                            <div className="text-center">
                                <h1 className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-stone-900">
                                    Forever Young NYC
                                </h1>
                                <p className="text-[0.65rem] text-stone-500 font-medium tracking-[0.25em] uppercase mt-1">
                                    Admin Portal
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-stone-500 block mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-stone-500 block mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-gentle-fade">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>


                    </form>
                </div>

                {/* Decorative footer text */}
                <div className="text-center mt-8 text-[10px] text-stone-300 uppercase tracking-[0.3em]">
                    Secure Admin Access
                </div>
            </div>
        </div>
    );
};

export default Login;
