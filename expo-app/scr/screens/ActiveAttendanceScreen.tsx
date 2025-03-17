import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Attendance, Subject } from '../types/apiTypes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [secounds, setSecounds] = useState(0);


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


    const calculateTimeElapsed = () => {
        const startTime = new Date(attendance.startTime);
        const now = new Date();
        const diffMs = now.getTime() - startTime.getTime();

        setHours(Math.floor(diffMs / (1000 * 60 * 60)));
        setMinutes(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
        setSecounds(Math.floor((diffMs % (1000 * 60)) / 1000));

    }

    useEffect(() => {
        calculateTimeElapsed();
        const interval = setInterval(() => {
            calculateTimeElapsed();
        }, 1000);

        return () => clearInterval(interval);
    }, [attendance.startTime]);


    return (
        <SafeAreaProvider>

            <SafeAreaView style={styles.safeTop} edges={["top"]}>
                <StatusBar backgroundColor="#067BC2" barStyle="light-content" />
            </SafeAreaView>
            <View style={styles.container}>


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




                <View style={styles.timeContainer}>

                    <Text style={styles.sectionLabel}>{'Time elapsed'.toUpperCase()}</Text>


                    <View style={styles.countdownContainer}>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeValue}>{hours}</Text>
                            <Text style={styles.timeLabel}>HRS</Text>
                        </View>
                        <View style={styles.timeBoxSeparator}></View>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeValue}>{minutes}</Text>
                            <Text style={styles.timeLabel}>MINS</Text>
                        </View>
                        <View style={styles.timeBoxSeparator}></View>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeValue}>{secounds}</Text>
                            <Text style={styles.timeLabel}>SECS</Text>
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search by name"
                            placeholderTextColor="#fff"
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
                            containerStyle={styles.dropdownContainer}
                            dropdownPosition="auto"
                            renderLeftIcon={() => (
                                <Ionicons name="swap-vertical-outline" size={18} color="#fff" />
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
                            containerStyle={styles.dropdownContainer}
                            dropdownPosition="auto"
                            renderLeftIcon={() => (
                                <Ionicons name="funnel-outline" size={12} color="#fff" />
                            )}
                            renderRightIcon={() => null}
                        />
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
            </View>

        </SafeAreaProvider>
    );
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#067BC2',
    },

    safeTop: {
        backgroundColor: "#067BC2",
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



    // table
    tableContainer: {
        backgroundColor: '#ffffff',
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
        padding: 12,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "#ddd",
        color: 'black',
        fontFamily: 'JetBrainsMono-Regular',
    },

    dropdown: {
        backgroundColor: "rgba(2, 2, 2, 0.1)",
        padding: 12,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 35,
        color: 'black',
    },

    dropdownContainer: {
        width: '100%',
        position: 'absolute',
        top: 160,
        left: 0,
        zIndex: 100,  //
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },



    // time ellipsed 

    timeContainer: {
        alignItems: "center",
        backgroundColor: "#067BC2",
        paddingVertical: 8,
        paddingHorizontal: 16,

    },

    sectionLabel: {
        textAlign: 'center',
        color: '#ddd',
        fontSize: 14,
        fontFamily: 'JetBrainsMono-Bold',
    },
    countdownContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    timeBox: {
        alignItems: "center",
        marginHorizontal: 16,
        padding: 8,
    },
    timeValue: {
        fontSize: 28,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: "#fff",
    },
    timeLabel: {
        fontSize: 14,
        color: "#ddd",
        fontFamily: 'JetBrainsMono-Regular',
    },
    timeBoxSeparator: {
        width: 2,
        height: 40,
        backgroundColor: "#ddd",
    },

});

export default ActiveAttendanceScreen;