import React from 'react';
import { Text } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import colors from '../../styles/colors';

const CustomTabBar = (props) => (
    <TabBar
        {...props}
        style={{
            backgroundColor: colors.primary,
            fontFamily: 'JetBrainsMono-ExtraBold',
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
