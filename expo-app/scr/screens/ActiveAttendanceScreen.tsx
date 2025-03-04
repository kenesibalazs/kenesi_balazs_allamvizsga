import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Attendance } from '../types/apiTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define props for the screen
type RootStackParamList = {
    ActiveAttendance: { attendance: Attendance };
};

type ActiveAttendanceScreenProps = {
    route: RouteProp<RootStackParamList, 'ActiveAttendance'>;
};

const ActiveAttendanceScreen: React.FC<ActiveAttendanceScreenProps> = ({ route }) => {
    const { attendance } = route.params;
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

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
                <View style={styles.tableContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, { flex: 0.1, textAlign: 'left' }]}>#</Text>
                        <Text style={[styles.headerCell, { flex: 0.4, textAlign: 'left' }]}>Name</Text>
                        <Text style={[styles.headerCell, { flex: 0.2 }]}>Status</Text>
                        <Text style={[styles.headerCell, { flex: 0.3, textAlign: 'right' }]}>Join Time</Text>
                    </View>
                    <FlatList
                        data={attendance.participants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            const statusStyle = item.status === 'absent'
                                ? styles.absentStatus
                                : item.status === 'present'
                                    ? styles.presentStatus
                                    : {};
                            return (
                                <View style={styles.row}>
                                    <Text style={[styles.cell, { flex: 0.05 }]}>{index + 1}</Text>
                                    <Text style={[styles.cell, { flex: 0.45 }, styles.nameCell]}>{(item.userId as { name: string }).name}</Text>
                                    <Text style={[styles.cell, statusStyle, { flex: 0.2 }]}>{item.status}</Text>
                                    <Text style={[styles.cell, { flex: 0.3, textAlign: 'center' }]}>null </Text>
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
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#f1f3f5',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    headerCell: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
        color: '#343a40',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#ffffff',
    },
    cell: {
        textAlign: 'left',
        fontSize: 12,
        color: '#212529',
    },
    nameCell: {
        fontWeight: '600',
    },
    absentStatus: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        color: '#dc3545',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#dc3545',
        textAlign: 'center',
    },
    presentStatus: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        color: '#28a745',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#28a745',
    },
});

export default ActiveAttendanceScreen;
