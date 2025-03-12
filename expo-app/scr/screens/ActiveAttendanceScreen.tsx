import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Attendance } from '../types/apiTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

// Define props for the screen
type RootStackParamList = {
    ActiveAttendance: { attendance: Attendance };
};

type ActiveAttendanceScreenProps = {
    route: RouteProp<RootStackParamList, 'ActiveAttendance'>;
};

const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
];

const sortOptions = [
    { label: 'Name Asc', value: 'name_asc' },
    { label: 'Name Desc', value: 'name_desc' },
    { label: 'Status Asc', value: 'status_asc' },
    { label: 'Status Desc', value: 'status_desc' },
];

const ActiveAttendanceScreen: React.FC<ActiveAttendanceScreenProps> = ({ route }) => {
    const { attendance } = route.params;
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
    const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('name_asc');

    const filteredParticipants = attendance.participants
        .filter(participant => (participant.userId as { name: string }).name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(participant => filterStatus === 'all' || participant.status === filterStatus)
        .sort((a, b) => {
            if (sortOption.includes('name')) {
                return sortOption === 'name_asc'
                    ? (a.userId as { name: string }).name.localeCompare((b.userId as { name: string }).name)
                    : (b.userId as { name: string }).name.localeCompare((a.userId as { name: string }).name);
            } else {
                return sortOption === 'status_asc'
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
        });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Occasion Subject Name</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="menu" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Text style={styles.infoText}>Start Time: {new Date(attendance.startTime).toLocaleString()}</Text>

            <View style={styles.controls}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by name"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <Dropdown
                    data={sortOptions}
                    labelField="label"
                    valueField="value"
                    value={sortOption}
                    onChange={item => setSortOption(item.value)}
                    style={styles.dropdown}
                    renderLeftIcon={() => (
                        <Ionicons name="swap-vertical-outline" size={18} color="#000" />
                    )}
                    renderRightIcon={() => null}
                />
                <Dropdown
                    data={filterOptions}
                    labelField="label"
                    valueField="value"
                    value={filterStatus}
                    onChange={item => setFilterStatus(item.value)}
                    style={styles.dropdown}
                    placeholder="Filter by status"
                    renderLeftIcon={() => (
                        <Ionicons name="funnel-outline" size={18} color="#000" />
                    )}
                    renderRightIcon={() => null}
                />
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, { flex: 1 }]}>#</Text>

                    <Text style={[styles.cell, { flex: 5 }]}>Name</Text>
                    <Text style={[styles.cell, { flex: 2 }]}>Status</Text>
                    <Text style={[styles.cell, { flex: 2 }]}>Join Time</Text>
                </View>
                <FlatList
                    data={filteredParticipants}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const statusStyle = item.status === 'absent'
                            ? styles.absentStatus
                            : item.status === 'present'
                                ? styles.presentStatus
                                : {};
                        return (
                            <View style={styles.row}>
                                <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
                                <View style={styles.userContainer}>
                                    <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.userImage} />
                                    <Text style={[styles.cell, styles.nameCell]}>{(item.userId as { name: string }).name}</Text>
                                </View>

                                <Text style={[styles.cell, statusStyle, { flex: 2 }]}>{item.status}</Text>
                                <Text style={[styles.cell, { flex: 2 }]}> null </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    screenHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    moreButton: {
        padding: 8,
    },
    scrollContainer: {
        padding: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        marginBottom: 20,
    },
    tableContainer: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRow: { flexDirection: 'row', padding: 8, backgroundColor: '#4A90E2', borderRadius: 8 },
    row: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
    cell: { flex: 1, fontSize: 14, color: '#212529' },
    nameCell: {
        fontWeight: '600',
    },
    absentStatus: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        color: '#dc3545',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#dc3545',
        textAlign: 'center',
    },
    presentStatus: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        color: '#28a745',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#28a745',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
    },
    searchBar: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 12,
        borderRadius: 100,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        color: 'black',
    },
    dropdown: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 100,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        color: 'black',
    },
    userContainer: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 28,
        height: 28,
        borderRadius: 16,
        marginRight: 4,
    }
});

export default ActiveAttendanceScreen;