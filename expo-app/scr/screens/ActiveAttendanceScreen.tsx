import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

import { ActiveAttendanceScreenRouteProp } from '../types/navigationTypes';
import { Header, SafeAreaWrapper, TimeDisplay } from '../components/common';
import { Subject } from '../types/apiTypes';
import { useAttendance } from '../hooks';
import { Theme } from '../styles/theme';


const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
];

const ActiveAttendanceScreen: React.FC<{ route: ActiveAttendanceScreenRouteProp }> = ({ route }) => {
    const { fetchAttendanceById } = useAttendance();
    const [attendance, setAttendance] = useState(route.params.attendance);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
    const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('name_asc');


    const toggleSort = (field: 'name' | 'status') => {
        setSortOption((prev) => {
            if (prev === `${field}_asc`) return `${field}_desc`;
            return `${field}_asc`;
        });
    };

    const filteredParticipants = attendance.participants
        .filter(participant => filterStatus === 'all' || participant.status === filterStatus)
        .sort((a, b) => {
            if (sortOption.includes('name')) {
                return sortOption === 'name_asc'
                    ? (a.userId as { name: string }).name.localeCompare((b.userId as { name: string }).name)
                    : (b.userId as { name: string }).name.localeCompare((a.userId as { name: string }).name);
            }
        });

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const updatedAttendance = await fetchAttendanceById(attendance._id);
            setAttendance(updatedAttendance);
        } catch (error) {
            console.error("Failed to refresh attendance:", error);
        }
        setRefreshing(false);
    };

    return (
        <SafeAreaWrapper>

            <Header
                title={(attendance.subjectId as Subject).name}
                leftIcon={"arrow-back"}
                onLeftPress={() => navigation.goBack()}
                rightIcon={"download-outline"}
                onRightPress={() => { }}

            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }

            >
                <View style={styles.container}>

                    <Text style={styles.headerLabel}>{'Class Info'.toUpperCase()}</Text>


                    <Animatable.View style={styles.headerCard} animation="fadeInDown" duration={500} delay={50}>
                        <TimeDisplay title="Time Elapsed" targetTime={new Date(attendance.startTime).toISOString()} isElapsed={true} />

                        <LottieView
                            source={
                                require('../../assets/animations/activeTeacher.json')
                            }
                            autoPlay
                            style={styles.animation}
                        />
                    </Animatable.View>



                    <Text style={styles.headerLabel}>{'Participants'.toUpperCase()}</Text>

                    <Animatable.View  animation="fadeInRight" duration={500} delay={50}style={styles.filterButtons}>
                        {filterOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.filterButton, filterStatus === option.value && styles.activeFilterButton]}
                                onPress={() => setFilterStatus(option.value as 'all' | 'present' | 'absent')}
                            >
                                <Text style={[styles.filterButtonText, filterStatus === option.value && styles.activeFilterButtonText]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animatable.View>


                    <Animatable.View  animation="fadeInUp" duration={500} delay={50} style={styles.maintableContainer}>

                        <View style={styles.headerRow}>
                            <Text style={[styles.headercell, { flex: 1 }]}>#</Text>
                            <TouchableOpacity onPress={() => toggleSort('name')} style={[{ flex: 7 }]}>
                                <Text style={styles.headercell}>Name {sortOption.includes('name') ? (sortOption === 'name_asc' ? '\u2191' : '\u2193') : ''}</Text>
                            </TouchableOpacity>
                            <Text style={[styles.headercell, { flex: 2, textAlign: 'center', marginRight: 12 }]}>Status</Text>
                        </View>
                        <View

                        >
                            {filteredParticipants.map((item, index) => {
                                const statusStyle = item.status === 'absent'
                                    ? styles.absentStatus
                                    : item.status === 'present'
                                        ? styles.presentStatus
                                        : {};
                                return (
                                    <TouchableOpacity key={index} style={styles.row}>
                                        <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
                                        <View style={styles.userContainer}>
                                            <Animatable.View animation="fadeIn" duration={500} delay={index * 50}>
                                            {typeof item.userId === 'object' && item.userId.profileImage ? (
                                              <Image
                                                source={{ uri: item.userId.profileImage }}
                                                style={styles.userImage}
                                              />
                                            ) : (
                                              <View style={styles.fallbackAvatar}>
                                                <Text style={styles.fallbackAvatarText}>
                                                  {(item.userId as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </Text>
                                              </View>
                                            )}
                                            </Animatable.View>
                                            <Text style={[styles.cell, styles.nameCell]}>
                                                {(item.userId as { name: string }).name}
                                            </Text>
                                        </View>
                                        <Text style={[styles.cell, statusStyle, { flex: 2 }]}>{item.status}</Text>
                                        <Ionicons name="chevron-forward-outline" size={16} color="#A9A9A9" />
                                    </TouchableOpacity>
                                );
                            })}

                        </View>

                    </Animatable.View>




                </View>
            </ScrollView>

        </SafeAreaWrapper>
    );
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 16,
    },

    headerLabel: {
        fontSize: Theme.fontSize.large,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.text.light,
    },

    headerCard: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderRadius: 22,
        borderColor: Theme.colors.borderColor,
        backgroundColor: Theme.colors.primaryTransparent
    },

    filterButtons: {
        flexDirection: 'row',
    },

    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: Theme.borderRadius.large,
        marginRight: 7,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor
    },


    activeFilterButton: {
        borderColor: Theme.colors.myblue,
    },

    filterButtonText: {
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
    },

    activeFilterButtonText: {
        fontFamily: Theme.fonts.extraBold,
    },

    animation: {
        width: 100,
        height: 100,

    },


    maintableContainer: {
        borderWidth: 1,
        borderRadius: Theme.borderRadius.extraLarge,
        borderColor: Theme.colors.borderColor,
        backgroundColor: Theme.colors.primaryTransparent,
        padding: 8,
    },


    headerRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.borderColor,
        justifyContent: 'space-between',
    },

    headercell: {
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.text.light
    },

    row: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        height: 60,
        borderRadius: 14,
        marginBottom: 4,
        backgroundColor: Theme.colors.primaryTransparent,
    },
    cell: {
        flex: 1,
        fontSize: 14,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.extraBold,

    },

    userContainer: {
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },


    nameCell: {
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.text.light,
        marginLeft: Theme.margin.small

    },

    absentStatus: {
        color: 'red',
        textAlign: 'center',
        fontFamily: Theme.fonts.extraBold,

    },

    presentStatus: {
        color: 'green',
        textAlign: 'center',
        fontFamily: Theme.fonts.extraBold,
    },

    userImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 2,
        borderColor: Theme.colors.myblue,
        backgroundColor: Theme.colors.primaryTransparent,
    },

    fallbackAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: Theme.colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fallbackAvatarText: {
        color: 'white',
        fontFamily: Theme.fonts.regular,
        fontSize: 16,
    },

    occasionInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },

    occasionIncoCard: {
        flex: 1,
        height: 110,
        flexDirection: 'row',
        backgroundColor: Theme.colors.primaryTransparent,
        padding: 12,
        borderWidth: 1,
        borderRadius: 22,
        borderColor: Theme.colors.borderColor,
    }

});

export default ActiveAttendanceScreen;