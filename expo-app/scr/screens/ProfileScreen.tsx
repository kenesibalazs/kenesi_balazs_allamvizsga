import React from 'react';
import { View, Text, StyleSheet, Button, ViewStyle, TextStyle } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Adjust the path as per your project structure

// Define the types for the styles to ensure better type safety
interface Styles {
    container: ViewStyle;
    text: TextStyle;
    button: ViewStyle;
}

const ProfileScreen: React.FC = () => {
    const { logout } = useAuth(); 

    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Screen</Text>
            <Button title="Logout" onPress={handleLogout}  />
        </View>
    );
};

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default ProfileScreen;
