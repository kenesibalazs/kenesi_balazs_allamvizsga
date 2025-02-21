/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Keyboard, Animated, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import useSignup from '../hooks/useSignup';

const RegisterWithNeptun = ({ navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const [neptunCode, setNeptunCode] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');

  const { error, signupUserWithNeptun, loading } = useSignup();

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
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [animatedValue]);

  const handleNeptunRegister = async () => {
    try {
      await signupUserWithNeptun({
        neptunCode,
        password,
        universityId: "6698ea0d0cac8449bf4c7ed9",
      });
    } catch (err) {
      console.error("Neptun registration error:", err);
    }
  };

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
        <Text variant="headlineLarge" style={styles.title}>
          Register With Neptun
        </Text>

        {/* Neptun Code Input */}
        <Text style={styles.label}>Neptun Code</Text>
        <TextInput
          mode="outlined"
          placeholder="Enter Neptun Code"
          value={neptunCode}
          onChangeText={setNeptunCode}
          style={styles.input}
        />

        {/* Password Input */}
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
          onPress={handleNeptunRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Register
        </Button>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Back To Login</Text>
            </TouchableOpacity>
          </Text>
        </View>

        {error && (
          <Snackbar
            visible={true}
            onDismiss={() => {}}
            style={styles.errorSnackbar}
          >
            {error}
          </Snackbar>
        )}
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
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    borderRadius: 8,
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 4,
  },
  errorSnackbar: {
    backgroundColor: 'red',
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default RegisterWithNeptun;