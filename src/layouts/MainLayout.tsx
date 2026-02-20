import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
    const { logout, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-stone-50/50 font-sans text-stone-800">
            <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 transition-all duration-300">
                {/* Subtle rose gold accent line at the top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                src="/lgo.png"
                                alt="Forever Young NYC Logo"
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="flex flex-col justify-center">
                                <h1 className="text-[0.7rem] uppercase tracking-[0.15em] font-medium text-stone-900 group-hover:text-primary transition-colors">
                                    Forever Young NYC
                                </h1>
                                <p className="text-[0.6rem] text-stone-500 font-medium tracking-[0.2em] uppercase">
                                    Admin Portal
                                </p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => navigate('/')} className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">Appointments</button>
                            <button onClick={() => navigate('/enquiries')} className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">Enquiries</button>
                        </nav>
                    </div>

                    {/* User info and logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-stone-400 uppercase tracking-widest">Logged in as</p>
                            <p className="text-sm font-medium text-stone-700">{username}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-primary border border-stone-200 hover:border-primary rounded-full transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="py-10 animate-gentle-fade">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
