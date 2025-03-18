import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors'; 

const DashboardHeader = ({
    title,
    leftIcon = null,
    onLeftPress = () => { },
    rightIcon = null,
    onRightPress = () => { }
}) => {
    return (
        <View style={styles.headerContainer}>
            {leftIcon ? (
                <TouchableOpacity onPress={onLeftPress} style={styles.iconWrapper}>
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={colors.textLight}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}

            <Text style={styles.headerText}>{title}</Text>

            {rightIcon ? (
                <TouchableOpacity onPress={onRightPress} style={styles.iconWrapper}>
                    <Ionicons
                        name={rightIcon}
                        size={18}
                        color={colors.textLight}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: colors.primary,
    },

    iconWrapper: {
        padding: 6,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    placeholder: {
        width: 30,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: colors.textLight,
        fontWeight: '900',
        textAlign: 'center',
        flex: 1, // Ensures title is centered
    },
});

export default DashboardHeader;
