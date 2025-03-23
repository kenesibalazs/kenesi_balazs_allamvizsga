/*eslint-disable */
// MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import MainPage from '../screens/MainPage'; 
import TimetableScreen from '../screens/TimetableScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { Theme } from '../styles/theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({

                tabBarStyle: {
                    backgroundColor: Theme.colors.primary, 
                    borderTopColor: "transparent",
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Timetable') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={MainPage} options={{headerShown: false}} />
            <Tab.Screen name="Timetable" component={TimetableScreen} options={{ headerShown: false }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileScreen}  options={{ headerShown: false }}/>
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
