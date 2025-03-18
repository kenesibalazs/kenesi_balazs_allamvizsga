import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { OccasionInfoScreenRouteProp } from '../types/navigationTypes';
import { ScrollView } from "react-native-gesture-handler";
import { Header, SafeAreaWrapper, TimeDisplay } from '../components/common';
import colors from '../styles/colors';

const OccasionInfoScreen: React.FC = () => {
    const route = useRoute<OccasionInfoScreenRouteProp>();
    const { occasion, startTime, endTime } = route.params;
    const navigation = useNavigation();

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const calculateTimeUntilStart = () => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = start.getTime() - now.getTime();

        if (diff <= 0) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            return;
        }

        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    };

    useEffect(() => {
        calculateTimeUntilStart();
        const interval = setInterval(() => {
            calculateTimeUntilStart();
        }, 60000);

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <SafeAreaWrapper>
            <Header
                title="Occasion Info"
                leftIcon="arrow-back"
                onLeftPress={handleBackPress}

            />



            <View style={styles.subjectCard}>
                <TimeDisplay title="Time UNntil Start" targetTime={new Date(startTime).toISOString()} isElapsed={false} showDays={true} />



            </View>

            <View style={styles.headerRow}></View>

            <View style={styles.container}>



                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.infoCard}>

                        <View style={styles.infoRow}>
                            <Ionicons name="book-outline" size={16} color="#067BC2" style={styles.infoIcon} />

                            <View style={styles.infoSeparator} />

                            <View style={styles.infoCardDetails}>
                                <Text style={styles.label}>SUBJECT</Text>

                                <Text style={styles.infoText}>
                                    {typeof occasion.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                                </Text>


                            </View>


                            <TouchableOpacity style={styles.chevronButton}>
                                <Ionicons name="chevron-forward-outline" size={20} color="#A9A9A9" />
                            </TouchableOpacity>
                        </View>


                    </View>

                    <View style={styles.infoCard}>

                        <View style={styles.infoRow}>
                            <Ionicons name="person-outline" size={16} color="#067BC2" style={styles.infoIcon} />

                            <View style={styles.infoSeparator} />

                            <View style={styles.infoCardDetails}>
                                <Text style={styles.label}>TEACHER</Text>

                                <Text style={styles.infoText}>
                                    {typeof occasion.teacherId === 'object' ? occasion.teacherId.name : 'Unknown Teacher'}
                                </Text>


                            </View>


                            <TouchableOpacity style={styles.chevronButton}>
                                <Ionicons name="chevron-forward-outline" size={20} color="#A9A9A9" />
                            </TouchableOpacity>
                        </View>


                    </View>

                    <View style={styles.infoCard}>

                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={16} color="#067BC2" style={styles.infoIcon} />

                            <View style={styles.infoSeparator} />


                            <View style={styles.infoCardDetails}>
                                <Text style={styles.label}>CLASSROOM</Text>

                                <Text style={styles.infoText}>
                                    {typeof occasion.classroomId === 'object' ? occasion.classroomId.name : 'Unknown Classroom'}
                                </Text>


                            </View>

                            <TouchableOpacity style={styles.chevronButton}>
                                <Ionicons name="chevron-forward-outline" size={20} color="#A9A9A9" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.infoCard}>

                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={16} color="#067BC2" style={styles.infoIcon} />

                            <View style={styles.infoSeparator} />

                            <View style={styles.infoCardDetails}>

                                <Text style={styles.label}>TIME</Text>

                                <Text style={styles.infoText}>
                                    {occasion.dayId}: {occasion.startTime} - {occasion.endTime}
                                </Text>

                            </View>

                        </View>
                    </View>

                    <View style={styles.infoCard}>

                        <View style={styles.infoRow}>
                            <Ionicons name="people-outline" size={16} color="#067BC2" style={styles.infoIcon} />

                            <View style={styles.infoSeparator} />

                            <View style={styles.infoCardDetails}>
                                <Text style={styles.label}>GROUPS</Text>

                                <Text style={styles.infoText}>
                                    {Array.isArray(occasion.groupIds) && occasion.groupIds.length > 0 ? (
                                        occasion.groupIds.map((group, index) => (
                                            <Text key={index} style={styles.infoText}>
                                                {typeof group === 'object' ? group.name : 'Unknown Group'}
                                            </Text>


                                        ))
                                    ) : (
                                        <Text style={styles.infoText}>No Groups</Text>
                                    )}




                                </Text>
                            </View>



                        </View>
                    </View>





                </ScrollView>


            </View>
        </SafeAreaWrapper>
    );
};



const styles = StyleSheet.create({
    safeTop: {
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#067BC2',
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: '#fff',
    },
    icon: {
        padding: 8,
        borderRadius: 100,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    subjectCard: {
        alignItems: "center",
        backgroundColor: colors.primary,

    },




    infoCard: {
        backgroundColor: "rgba(6, 123, 194, 0.1)",
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
    },

    infoCardDetails: {
        flexDirection: "column",
    },

    label: {
        fontSize: 12,
        color: "#2196F3",

        fontFamily: 'JetBrainsMono-Regular',
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoIcon: {
        backgroundColor: "rgba(6, 123, 194, 0.1)",
        padding: 8,
        borderRadius: 50,
    },

    infoSeparator: {
        width: 2,
        height: "60%",
        backgroundColor: "#D0D0D0",
        marginHorizontal: 12,
    },

    infoText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        fontFamily: 'JetBrainsMono-Bold',
    },

    chevronButton: {
        padding: 8,
        marginLeft: 'auto',
    },

    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#382E34',
        justifyContent: 'space-between',
    },

    contentContainer: {
        padding: 16
    }
});

export default OccasionInfoScreen;
