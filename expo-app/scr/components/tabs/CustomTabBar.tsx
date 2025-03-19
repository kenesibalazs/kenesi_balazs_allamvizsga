import React from 'react';
import { Text } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { Theme } from '../../styles/theme';
const CustomTabBar = (props) => (
    <TabBar
        {...props}
        style={{
            backgroundColor: Theme.colors.primary,
            fontFamily: Theme.fonts.extraBold,
        }}
        indicatorStyle={{ backgroundColor: '#fff', height: 3, borderRadius: 5 }}
        renderLabel={({ route, focused }) => (
            <Text style={{ color: focused ? '#f1c40f' : '#ccc', fontSize: 16 }}>
                {route.title}
            </Text>
        )}
        pressColor="rgba(0, 123, 255, 0.1)"
    />
);

export default CustomTabBar;
