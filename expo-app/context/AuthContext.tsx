import React, { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { User}  from '../types/apiTypes';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (newToken: string, newData: any) => void;
    logout: () => void;
    userData: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkStoredData = async () => {
            const storedData = await AsyncStorage.getItem('user_data');
            if (storedData) {
                const { userToken, user } = JSON.parse(storedData);
                setToken(userToken);
                setUserData(user);
                setIsAuthenticated(true);
            }
        };
        checkStoredData();
    }, []);

    const login = async (newToken: string, newData: any) => {
        await AsyncStorage.setItem('user_data', JSON.stringify({
            userToken: newToken,
            user: newData,
        }));

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('user_data');
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
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
