import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './screens/LoginScreen';
import MainPage from './screens/MainPage';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const App = () => {
    return (
        <AuthProvider>
            <PaperProvider>
                <MainContent />
                <Toast />
            </PaperProvider>
        </AuthProvider>
    );
};

const MainContent = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <MainPage /> : <LoginForm />;
};

export default App;
