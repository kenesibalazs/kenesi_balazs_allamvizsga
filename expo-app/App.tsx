import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainPage from './screens/MainPage';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

import MainTabNavigator from './navigation/MainTabNavigator'; // Import your tab navigator



const App = () => {
    return (
        <AuthProvider>
            <PaperProvider>
                <NavigationContainer>
                    <AuthStack />
                    <Toast />
                </NavigationContainer>
            </PaperProvider>
        </AuthProvider>
    );
};

const AuthStack = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                 <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default App;
