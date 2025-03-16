import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashboardHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity>
                <Ionicons style={styles.icon} name="settings" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>DASHBOARD</Text>
            <TouchableOpacity>
                <Ionicons style={styles.icon} name="person" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    icon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 6,
        borderRadius: 100,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: '#fff',
        fontWeight: '900',
    },
});

export default DashboardHeader;
