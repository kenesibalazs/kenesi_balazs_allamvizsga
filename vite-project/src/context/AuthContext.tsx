// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, FC } from "react";
import { User } from "../types/apitypes";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean | undefined; // Allow undefined for initial state
    login: (newToken: string, newData: User) => void;
    logout: () => void;
    userData: User | null;
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
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData }}>
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
