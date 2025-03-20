import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, StatusBar } from 'react-native';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { useAuth } from '../context/AuthContext';
import { Header, SafeAreaWrapper } from '../components/common';
import { Theme } from "../styles/theme";

const HistoryScreen: React.FC = () => {
    const { userData, logout } = useAuth();
    const { isValid, loading, error, checkSignature } = useVerifySignature();

    return (
        <SafeAreaWrapper>
            <Header
                title="History"
            />
            <View >
                <Text>CSINALD MEG HOLNAPIG!!!!!!!</Text>
            </View>

        </SafeAreaWrapper>
    )

};

const styles = StyleSheet.create({


});

export default HistoryScreen;
