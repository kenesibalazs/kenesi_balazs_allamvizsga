import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, StatusBar } from 'react-native';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { useAuth } from '../context/AuthContext';

import { Header, SafeAreaWrapper } from '../components/common';

const HistoryScreen: React.FC = () => {
    const { userData, logout } = useAuth();
    const { isValid, loading, error, checkSignature } = useVerifySignature();

    return (
        <SafeAreaWrapper>
            <Header
                title="History"
            />
            <View style={styles.contentContainer}>
                <Text>History Screen</Text>
            </View>

        </SafeAreaWrapper>
    )

};

const styles = StyleSheet.create({

    safeTop: {
        backgroundColor: "#067BC2",
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#067BC2',
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


    contentContainer: {
        flex: 1,
        backgroundColor: '#DFF8EB',
    }
});

export default HistoryScreen;
