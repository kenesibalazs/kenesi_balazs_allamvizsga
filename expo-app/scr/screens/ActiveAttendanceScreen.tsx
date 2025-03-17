import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Attendance, Subject } from '../types/apiTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

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


            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackPress} >
                    <Ionicons style={styles.icon} name="arrow-back" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    {(attendance.subjectId as Subject).name.toUpperCase()}
                </Text>


                <TouchableOpacity >
                    <Ionicons style={styles.icon} name="menu" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: '#fff', height: '100%' }}>


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
                        <Text style={[styles.headercell, { flex: 1 }]}>#</Text>
                        <Text style={[styles.headercell, { flex: 7 }]}>Name</Text>
                        <Text style={[styles.headercell, { flex: 2, textAlign: 'center' , marginRight: 12}]}>Status</Text>
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

                                    <TouchableOpacity>
                                        <Ionicons name="chevron-forward-outline" size={16} color="#A9A9A9" />
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#067BC2',
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    icon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 6,
        borderRadius: 100,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: '#fff',
        fontWeight: '900',
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


    tableContainer: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    headerRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#067BC2',
        justifyContent: 'space-between',
    },

    headercell: {
        color: '#fff',
        fontFamily: 'JetBrainsMono-Regular',
    },

    divider: {
        width: 1,
        height: '90%',
        backgroundColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        height: 60,
    },
    cell: {
        flex: 1,
        fontSize: 14,
        color: '#212529',

    },
    nameCell: {
        fontWeight: '600',
        fontFamily: 'JetBrainsMono-Bold',

    },
    absentStatus: {
        color: 'red',
        textAlign: 'center',
        fontFamily: 'JetBrainsMono-ExtraBold',

    },
    presentStatus: {
        color: 'green',
        textAlign: 'center',
        fontFamily: 'JetBrainsMono-ExtraBold',
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
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 28,
        height: 28,
        borderRadius: 16,
        marginRight: 4,
    },


    attendanceInfo: {
        paddingHorizontal: 16,
        flexDirection: 'column',
        alignItems: 'center',

    },
    timeElapsedLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        paddingHorizontal: 28,
    },



});

export default ActiveAttendanceScreen;