import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../styles/theme';
const SafeAreaWrapper = ({ children, backgroundColor = Theme.colors.primary }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.safeTop, { backgroundColor }]} edges={["top"]}>
                <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
            </SafeAreaView>
            <View style={styles.container}>
                {children}
            </View>

          
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    safeTop: {
        backgroundColor: Theme.colors.primary,
    },
    safeBottom: {
        backgroundColor: Theme.colors.primary,
    },
    container: {
        flex: 1,
        backgroundColor: "#141414",
    },
});

export default SafeAreaWrapper;
