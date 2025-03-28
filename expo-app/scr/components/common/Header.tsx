import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from "../../styles/theme";
const DashboardHeader = ({
    title,
    leftIcon = null,
    onLeftPress = () => { },
    rightIcon = null,
    onRightPress = () => { },
    rightColored = false
}) => {
    return (
        <View style={styles.headerContainer}>
            {leftIcon ? (
                <TouchableOpacity onPress={onLeftPress} style={styles.iconWrapper}>
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={Theme.colors.textLight}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}

            <Text style={styles.headerText}>{title}</Text>

            {rightIcon ? (
                <TouchableOpacity onPress={onRightPress} style={
                    rightColored ? styles.iconWrapperColored : styles.iconWrapper}>
                    <Ionicons
                        name={rightIcon}
                        size={18}
                        color={
                            rightColored ? Theme.colors.white : Theme.colors.textLight}
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
        backgroundColor: Theme.colors.primary,
    },

    iconWrapper: {
        padding: 6,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconWrapperColored: {
        padding: 6,
        borderRadius: 100,
        backgroundColor:Theme.colors.myblue,
    },

    placeholder: {
        width: 30,
    },
    headerText: {
        fontSize: 18,
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        fontWeight: '900',
        textAlign: 'center',
        flex: 1,
    },
});

export default DashboardHeader;
