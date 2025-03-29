import { StyleSheet } from "react-native";
import { Padding } from "./padding";
import { Margin } from "./margin";
import { BorderRadius } from "./borderRadius";
import { Colors } from "./colors";
import { FontSize } from "./fontSize";
import { Fonts } from "./fonts";
export const GlobalStyles = StyleSheet.create({
    container: {
        padding: Padding.medium,
    },

    dataContainer: {
        marginBottom: Margin.large,
    },

    animation: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 150,
        height: 125,
    },


    card: {
        borderRadius: BorderRadius.extraLarge,
        padding: Padding.medium,
        backgroundColor: Colors.primaryTransparent,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },

    subtitle: {
        fontSize: FontSize.large,
        marginBottom: Margin.medium,
        fontFamily: Fonts.bold,
        color: Colors.textLight,
    },

    badgeLabel: {
        fontSize: FontSize.small,
        color: Colors.accent,
        fontFamily: Fonts.regular,
    },

    bigLabel: {
        fontSize: FontSize.extraLarge,
        fontFamily: Fonts.extraBold,
        color: Colors.textLight,
        marginBottom: Margin.small,
    },

    smallLabel: {
        fontSize: FontSize.medium,
        color: Colors.text.light,
        marginBottom: Margin.extraSmall,
        fontFamily: Fonts.regular,
    },

    mediumLabel: {
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold,
        color: Colors.textLight,
    },

    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Margin.small,
    },

    mediumProfilePicture: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        marginRight: Margin.small,
        borderWidth:2,
        borderColor: Colors.borderColor,
    },

    buttonContainer: {
        flexDirection: 'row',
    },

    defaultButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BorderRadius.large,
        backgroundColor: Colors.myblue,
    },

    endButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 32,
    }

});
