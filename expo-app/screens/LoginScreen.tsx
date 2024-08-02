import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import  useLogin  from '../hooks/useLogin';
import Toast from 'react-native-toast-message';

const LoginForm = () => {
    const [neptunCode, setNeptunCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { loginUser, loading, error } = useLogin();

    const handleLogin = () => {
        loginUser({ neptunCode, password });
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Neptun Code"
                value={neptunCode}
                onChangeText={setNeptunCode}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
                Login
            </Button>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default LoginForm;
