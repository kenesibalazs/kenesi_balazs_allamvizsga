import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Theme } from "../../styles/theme";

interface UserProfileCardProps {
    name: string;
    type: string;
    neptunCode?: string;
    majors?: string[];
    imageUri?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ name, type, neptunCode, majors, imageUri }) => {
    return (
        <View style={styles.profileCard}>

            <TouchableOpacity style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUri || 'https://assets.codepen.io/285131/hat-man.png' }}
                    style={styles.userImage}
                />
            </TouchableOpacity>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{name}</Text>
                {majors && <Text style={styles.userDetails}>{majors.join(', ')}</Text>}
                <Text style={styles.userDetails}>{type} - {neptunCode}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Theme.colors.primary,
        padding: Theme.padding.medium,
        minHeight: 200,
        
    },

    imageWrapper: {
        width: 110, 
        height: 110,
        borderRadius: Theme.borderRadius.full,
        borderWidth: 5,
        borderColor: Theme.colors.accent,
        alignItems: 'center',
        marginBottom: Theme.margin.small,

    },
    
    userImage: {
        width: 100,
        height: 100,
        borderRadius: Theme.borderRadius.full,
    },
    
    userInfo: {
        marginTop: Theme.margin.medium,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        gap: Theme.margin.extraSmall,

    },
    userName: {
        fontSize: Theme.fontSize.large,
        color: Theme.colors.white,
        fontFamily: Theme.fonts.extraBold,
    },
    userDetails: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
    },

});

export default UserProfileCard;
