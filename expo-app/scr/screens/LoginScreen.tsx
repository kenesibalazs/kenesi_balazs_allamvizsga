import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Animated } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import useLogin from '../hooks/useLogin';

const LoginScreen = ({ navigation }) => {
    const { loading, error, handleLogin } = useLogin();
    const [neptunCode, setNeptunCode] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [animatedValue] = useState(new Animated.Value(0));

    const onLoginPress = async () => {
        await handleLogin({ neptunCode, password });
        if (error) setVisible(true);
    };

    const onDismissSnackBar = () => setVisible(false);

    useEffect(() => {
        if (error) setVisible(true);
    }, [error]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
            Animated.timing(animatedValue, {
                toValue: -150, 
                duration: 300, 
                useNativeDriver: true,
            }).start();
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            Animated.timing(animatedValue, {
                toValue: 0, 
                duration: 300,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [animatedValue]);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/register.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <Animated.View
                style={[styles.formContainer, { transform: [{ translateY: animatedValue }] }]}
            >
                <Text variant="headlineLarge" style={styles.title}>Login</Text>

                {/* Neptun Code Input */}
                <Text style={styles.label}>Neptun Code</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter Neptun Code"
                    value={neptunCode}
                    onChangeText={setNeptunCode}
                    style={styles.input}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={onLoginPress}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>

                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.text}>OR</Text>
                    <View style={styles.line} />
                </View>

                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('RegisterWithNeptun')}
                    style={styles.neptunButton}
                >
                    Register with Neptun
                </Button>

                <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                        Don't have an account?{" "}
                        <TouchableOpacity onPress={() => console.log('Create one TODOO')}>
                            <Text style={styles.link}>Create one</Text>
                        </TouchableOpacity>
                    </Text>
                </View>

                {/* <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Close',
                        onPress: () => setVisible(false),
                    }}
                    style={styles.errorSnackbar}
                >
                    {error}
                </Snackbar> */}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        height: 400,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    formContainer: {
        padding: 32,
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        top: 300, 
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        elevation: 2,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold', // Use Poppins Regular
        fontSize: 24, // Adjust size as needed
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular', // Updated to Poppins Regular
        fontSize: 14,
    },
    input: {
        width: '100%',
        marginBottom: 10,
        fontFamily: 'Poppins-Regular', // Updated to Poppins Regular
        fontSize: 14, // Adjust size for better readability
        borderRadius: 8,
    },
    button: {
        width: '100%',
        marginTop: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 4,
    },
    neptunButton: {
        width: '100%',
        borderRadius: 8,
        padding: 4,
    },
    errorSnackbar: {
        backgroundColor: 'red',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#000',
    },
    text: {
        marginHorizontal: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular', // Updated to Poppins Regular
        fontWeight: '600',
    },
    linkContainer: {
        marginTop: 16,
        alignItems: 'center',
        width: '100%',
    },
    linkText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular', // Updated to Poppins Regular
    },
    link: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
