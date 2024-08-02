import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { InputItem, Button, ActivityIndicator, Toast } from '@ant-design/react-native';
import useSignup from '../hooks/useSignup';
import useUniversities from '../hooks/useUniversities';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = ({ navigation }: any) => {
    const { loading, error, registerUser } = useSignup();
    const { universities } = useUniversities();
    const { majors, fetchMajors } = useMajors();
    const { groups, fetchGroups } = useGroups();

    const [name, setName] = useState<string>('');
    const [neptunCode, setNeptunCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [universityId, setUniversityId] = useState<string | null>(null);
    const [majorIds, setMajorIds] = useState<string[]>([]);
    const [groupIds, setGroupIds] = useState<string[]>([]);

    useEffect(() => {
        if (universityId) {
            fetchMajors(universityId);
        }
    }, [universityId, fetchMajors]);

    useEffect(() => {
        if (majorIds.length > 0) {
            fetchGroups(majorIds);
        }
    }, [majorIds, fetchGroups]);

    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            Toast.fail('Passwords do not match', 1);
            return;
        }

        const values = { name, neptunCode, universityId, majorIds, groupIds, password };
        try {
            await registerUser(values);
            Toast.success('Registration successful!', 1);
        } catch (err) {
            Toast.fail('Registration failed. Please try again.', 1);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Personal Information</Text>
                <InputItem
                    placeholder="Name"
                    value={name}
                    onChange={setName}
                    style={styles.input}
                >
                    Name
                </InputItem>
                <InputItem
                    placeholder="Neptun Code"
                    value={neptunCode}
                    onChange={setNeptunCode}
                    style={styles.input}
                >
                    Neptun Code
                </InputItem>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Educational Information</Text>

                <DropDownPicker
                    items={universities.map((university) => ({ label: university.name, value: university._id }))}
                    value={universityId}
                    containerStyle={{ height: 40 }}
                    multiple={false}
                    setValue={(value) => setUniversityId(value)}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Account Information</Text>
                <InputItem
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    style={styles.input}
                >
                    Password
                </InputItem>
                <InputItem
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                    style={styles.input}
                >
                    Confirm Password
                </InputItem>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
                type="primary"
                loading={loading}
                onPress={handleRegister}
                style={styles.button}
            >
                {loading ? 'Registering...' : 'Register'}
            </Button>

            <Button
                type="ghost"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
            >
                Back to Login
            </Button>

            {loading && <ActivityIndicator animating size="large" />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    section: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    select: {
        marginBottom: 10,
    },
    button: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default RegisterScreen;
