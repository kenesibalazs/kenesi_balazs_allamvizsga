/*eslint-disable */
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './scr/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './scr/screens/LoginScreen';
import RegisterWithNeptun from './scr/screens/RegisterWithNeptun';
import { useFonts } from 'expo-font';

import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

import MainTabNavigator from './scr/navigation/MainTabNavigator';

import MyModule from './modules/my-module';
import ActiveAttendanceScreen from './scr/screens/ActiveAttendanceScreen';
import OccasionInfoScreen from './scr/screens/OccasionInfoScreen';
import OccasionHistoryScreen from './scr/screens/OccasionHistoryScreen';


const App = () => {

    const [fontsLoaded] = useFonts({
        'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
        'JetBrainsMono-ExtraBold': require('./assets/fonts/JetBrainsMono-ExtraBold.ttf'),
        'JetBrainsMono-Bold': require('./assets/fonts/JetBrainsMono-Bold.ttf'),
        'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
        'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
        'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),

    });


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
                <>
                    <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
                    <Stack.Screen name="ActiveAttendance" component={ActiveAttendanceScreen} />
                    <Stack.Screen name="OccasionInfo" component={OccasionInfoScreen} />
                    <Stack.Screen name="OccasionHistory" component={OccasionHistoryScreen} />
                </>

            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
                    <Stack.Screen name="RegisterWithNeptun" component={RegisterWithNeptun} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default App;
