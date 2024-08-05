import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';


const MainPage = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}!</Text>
            <Card style={styles.card}>
                <Card.Title title="No Classes Started" />
                <Card.Content>
                    <Paragraph>Please come back later</Paragraph>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 20,
        left: 20,
    },
    logoutButton: {
        marginTop: 20,
    },
    card: {
        width: '90%',
        top: 20,
        marginBottom: 20,
        marginHorizontal: 20,
    },


});

export default MainPage;
