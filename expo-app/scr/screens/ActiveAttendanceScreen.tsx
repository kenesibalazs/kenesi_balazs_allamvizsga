import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Attendance, Subject } from '../types/apiTypes';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import colors from '../styles/colors';

import { Header, SafeAreaWrapper, TimeDisplay } from '../components/common';

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

const sortOptions: { label: string; value: "name_asc" | "name_desc" | "status_asc" | "status_desc" }[] = [
    { label: 'Name Asc', value: 'name_asc' },
    { label: 'Name Desc', value: 'name_desc' },
    { label: 'Status Asc', value: 'status_asc' },
    { label: 'Status Desc', value: 'status_desc' },
];


const ActiveAttendanceScreen: React.FC<ActiveAttendanceScreenProps> = ({ route }) => {
    const { attendance } = route.params;
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
    const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('name_asc');
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'sort' | 'filter'>('sort');

    const toggleModal = (type: 'sort' | 'filter') => {
        setModalType(type);
        setModalVisible(!isModalVisible);
    };

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
        <SafeAreaWrapper>
            <View style={styles.container}>

                <Header
                    title={(attendance.subjectId as Subject).name}
                    leftIcon={"arrow-back"}
                    onLeftPress={() => navigation.goBack()}
                    rightIcon={"menu"}
                    onRightPress={() => { }}

                />
                <View style={styles.controlContainer}>
                    <TimeDisplay title="Time Elapsed" targetTime={new Date(attendance.startTime).toISOString()} isElapsed={true}  />

                    <View style={styles.controls}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search by name"
                            placeholderTextColor="#fff"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />


                        <TouchableOpacity style={styles.modalButton} onPress={() => toggleModal('sort')}>
                            <Ionicons name="swap-vertical-outline" size={18} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => toggleModal('filter')}>
                            <Ionicons name="funnel-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                </View>


                <View style={{ flex: 1, backgroundColor: '#fff' }}>

                    <View style={styles.tableContainer}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.headercell, { flex: 1 }]}>#</Text>
                            <Text style={[styles.headercell, { flex: 7 }]}>Name</Text>
                            <Text style={[styles.headercell, { flex: 2, textAlign: 'center', marginRight: 12 }]}>Status</Text>
                        </View>
                        <ScrollView
                            style={styles.userListContainer}

                        >
                            {filteredParticipants.map((item, index) => {
                                const statusStyle = item.status === 'absent'
                                    ? styles.absentStatus
                                    : item.status === 'present'
                                        ? styles.presentStatus
                                        : {};
                                return (
                                    <View key={index} style={styles.row}>
                                        <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
                                        <View style={styles.userContainer}>
                                            <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.userImage} />
                                            <Text style={[styles.cell, styles.nameCell]}>
                                                {(item.userId as { name: string }).name}
                                            </Text>
                                        </View>
                                        <Text style={[styles.cell, statusStyle, { flex: 2 }]}>{item.status}</Text>
                                        <TouchableOpacity>
                                            <Ionicons name="chevron-forward-outline" size={16} color="#A9A9A9" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>

                    </View>
                </View>


                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'sort' ? 'Sort By' : 'Filter By'}
                        </Text>

                        {(modalType === 'sort' ? sortOptions : filterOptions).map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.modalOption}
                                onPress={() => {
                                    if (modalType === 'sort') setSortOption(option.value as "name_asc" | "name_desc" | "status_asc" | "status_desc");
                                    else setFilterStatus(option.value as "all" | "present" | "absent");
                                    setModalVisible(false);
                                }}

                            >
                                <Text style={styles.optionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Modal>

            </View>

        </SafeAreaWrapper>
    );
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#067BC2',
    },
    tableContainer: {
        backgroundColor: '#ffffff',
    },

    userListContainer: {
        height: '100%',
    },

    headerRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#382E34',
        justifyContent: 'space-between',
    },

    headercell: {
        color: '#fff',
        fontFamily: 'JetBrainsMono-Regular',
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

    userImage: {
        width: 28,
        height: 28,
        borderRadius: 16,
        marginRight: 4,
    },

    userContainer: {
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },

    // controls

    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    searchBar: {
        backgroundColor: "rgba(2, 2, 2, 0.1)",
        height: 35,
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "#ddd",
        color: '#fff',
        fontFamily: 'JetBrainsMono-Regular',
    },

    modalButton: {
        backgroundColor: "rgba(2, 2, 2, 0.1)",
        padding: 8,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 35,
        color: 'black',
    },


    controlContainer: {
        alignItems: "center",
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,

    },

   

    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
    },
    
});

export default ActiveAttendanceScreen;