import React, { createContext, useContext, useEffect, useState, ReactNode, FC } from "react";
import { User } from "../types/apitypes";

let externalLogout: () => void = () => {
    throw new Error("logout not initialized yet");
};

export const getExternalLogout = () => externalLogout;

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean | undefined; // Allow undefined for initial state
    login: (newToken: string, newData: User) => void;
    logout: () => void;
    userData: User | null;
    refreshUser: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('user_data') || 'null');
        if (storedData) {
            const { userToken, user } = storedData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (newToken: string, newData: User) => {
        localStorage.setItem(
            'user_data',
            JSON.stringify({ userToken: newToken, user: newData }),
        );

        setToken(newToken);
        setUserData({ ...newData, _id: (newData as any)._id || (newData as any).id });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };
    externalLogout = logout;

    const refreshUser = async () => {
        if (!token) return;

        try {
            const response = await fetch('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedUser: User = await response.json();
                setUserData(updatedUser);
                localStorage.setItem('user_data', JSON.stringify({ userToken: token, user: updatedUser }));
            } else {
                console.error('Failed to refresh user data: Unauthorized or invalid token.');
            }
        } catch (err) {
            console.error("Failed to refresh user data", err);
        }
    };

    const refreshToken = async () => {
        try {
            const res = await fetch('/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                const stored = localStorage.getItem('user_data');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    parsed.userToken = data.accessToken;
                    localStorage.setItem('user_data', JSON.stringify(parsed));
                    setToken(data.accessToken);
                    await refreshUser(); 
                }
            } else {
                console.warn('Refresh token invalid or expired');
                logout();
            }
        } catch (err) {
            console.error('Token refresh failed:', err);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData, refreshUser, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
