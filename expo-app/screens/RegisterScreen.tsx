import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TextInput, Button, Menu, Provider } from 'react-native-paper';
import useSignup from '../hooks/useSignup'; // Adjust the path as needed
import useUniversities from '../hooks/useUniversities';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import { University, Major, Group } from '../types/apiTypes'; // Adjust the path as needed


const RegisterScreen = ({ navigation }: any) => {
    const { loading, error, handleRegister } = useSignup();
    const { universities, fetchAllUniversities, error: universitiesError, loading: universitiesLoading } = useUniversities();
    const { majors, fetchMajorsByUniversityIdData, error: majorsError, loading: majorsLoading } = useMajors();
    const { groups, fetchGroupsByMajorIdData, error: groupsError, loading: groupsLoading } = useGroups();

    const [name, setName] = useState('');
    const [neptunCode, setNeptunCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [type, setType] = useState<'STUDENT' | 'TEACHER'>();
    const [universityMenuVisible, setUniversityMenuVisible] = useState(false);
    const [majorMenuVisible, setMajorMenuVisible] = useState(false);
    const [groupMenuVisible, setGroupMenuVisible] = useState(false);
    const [typeMenuVisible, setTypeMenuVisible] = useState(false);

    useEffect(() => {
        fetchAllUniversities();
    }, [fetchAllUniversities]);

    useEffect(() => {
        if (selectedUniversity) {
            fetchMajorsByUniversityIdData(selectedUniversity._id);
        }
    }, [selectedUniversity, fetchMajorsByUniversityIdData]);

    useEffect(() => {
        if (selectedMajor) {
            fetchGroupsByMajorIdData([selectedMajor._id]);
        }
    }, [selectedMajor, fetchGroupsByMajorIdData]);

    const handleSubmit = () => {
        const values = {
            name,
            neptunCode,
            password,
            passwordConfirm,
            universityId: selectedUniversity?._id || '',
            type,
            majors: selectedMajor ? [selectedMajor._id] : [],
            groups: selectedGroup ? [selectedGroup._id] : []
        };

        handleRegister(values);
    };

    if (universitiesLoading || majorsLoading || groupsLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <Provider>
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    label="Neptun Code"
                    value={neptunCode}
                    onChangeText={setNeptunCode}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                <TextInput
                    label="Confirm Password"
                    secureTextEntry
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    style={styles.input}
                />

                {/* University Menu */}
                <Menu
                    visible={universityMenuVisible}
                    onDismiss={() => setUniversityMenuVisible(false)}
                    anchor={<Button mode="outlined" onPress={() => setUniversityMenuVisible(true)}>{selectedUniversity ? selectedUniversity.name : 'Select University'}</Button>}
                >
                    {universities.map(university => (
                        <Menu.Item
                            key={university._id}
                            title={university.name}
                            onPress={() => {
                                setSelectedUniversity(university);
                                setUniversityMenuVisible(false);
                            }}
                        />
                    ))}
                </Menu>

                {/* Major Menu */}
                <Menu
                    visible={majorMenuVisible}
                    onDismiss={() => setMajorMenuVisible(false)}
                    anchor={<Button mode="outlined" onPress={() => setMajorMenuVisible(true)}>{selectedMajor ? selectedMajor.name : 'Select Major'}</Button>}
                >
                    {majors.map(major => (
                        <Menu.Item
                            key={major._id}
                            title={major.name}
                            onPress={() => {
                                setSelectedMajor(major);
                                setMajorMenuVisible(false);
                            }}
                        />
                    ))}
                </Menu>

                {/* Group Menu */}
                <Menu
                    visible={groupMenuVisible}
                    onDismiss={() => setGroupMenuVisible(false)}
                    anchor={<Button mode="outlined" onPress={() => setGroupMenuVisible(true)}>{selectedGroup ? selectedGroup.name : 'Select Group'}</Button>}
                >
                    {groups.map(group => (
                        <Menu.Item
                            key={group._id}
                            title={group.name}
                            onPress={() => {
                                setSelectedGroup(group);
                                setGroupMenuVisible(false);
                            }}
                        />
                    ))}
                </Menu>

                {/* Type Menu */}
                <Menu
                    visible={typeMenuVisible}
                    onDismiss={() => setTypeMenuVisible(false)}
                    anchor={<Button mode="outlined" onPress={() => setTypeMenuVisible(true)}>{type || 'Select Type'}</Button>}
                >
                    <Menu.Item
                        title="Student"
                        onPress={() => {
                            setType('STUDENT');
                            setTypeMenuVisible(false);
                        }}
                    />
                    <Menu.Item
                        title="Teacher"
                        onPress={() => {
                            setType('TEACHER');
                            setTypeMenuVisible(false);
                        }}
                    />
                </Menu>

                {error && <Text style={styles.error}>{error}</Text>}
                {universitiesError && <Text style={styles.error}>{universitiesError}</Text>}
                {majorsError && <Text style={styles.error}>{majorsError}</Text>}
                {groupsError && <Text style={styles.error}>{groupsError}</Text>}
                <Button mode="contained" onPress={handleSubmit} loading={loading}>
                    Register
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('Login')} // Adjust 'Login' to the correct route name if needed
                >
                    Already have an account? Back to Login
                </Button>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default RegisterScreen;
