import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import useLogin from '../hooks/useLogin'; // Adjust the path as needed

const LoginScreen = ({ navigation }: any) => {
    const { loading, error, handleLogin } = useLogin();
    const [neptunCode, setNeptunCode] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState<boolean>(false);

    const onLoginPress = () => {
        handleLogin({ neptunCode, password });
    };

    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Login</Text>
            <TextInput
                mode="outlined"
                label="Neptun Code"
                value={neptunCode}
                onChangeText={setNeptunCode}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            {error && 
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Close',
                        onPress: () => {
                            // Do something
                        },
                    }}
                    style={styles.errorSnackbar}
                >
                    {error}
                </Snackbar>
            }
            <Button
                mode="contained"
                onPress={onLoginPress}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
            >
                Register
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    registerButton: {
        marginTop: 10,
    },
    errorSnackbar: {
        backgroundColor: 'red',
    },
});

export default LoginScreen;
