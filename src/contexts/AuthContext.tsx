import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('admin_token');
        const savedUsername = localStorage.getItem('admin_username');
        if (token && savedUsername) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_username', username);
                setIsAuthenticated(true);
                setUsername(username);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setIsAuthenticated(false);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
