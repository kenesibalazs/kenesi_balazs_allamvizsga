import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { OccasionInfoScreenRouteProp } from '../types/navigationTypes';
import { ScrollView } from "react-native-gesture-handler";
import { Header, SafeAreaWrapper, TimeDisplay, SmallDataCard } from '../components/common';
import colors from '../styles/colors';

const OccasionInfoScreen: React.FC = () => {
    const route = useRoute<OccasionInfoScreenRouteProp>();
    const { occasion, startTime, endTime } = route.params;
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };



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

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >

                <SmallDataCard
                    leading={{ iconName: "book-outline" }}
                    label="SUBJECT"
                    data={[{
                        value: typeof occasion.subjectId === "object" ? occasion.subjectId.name : "Unknown Subject",
                        onPressFunction: () => console.log("Subject clicked:", occasion.subjectId),
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "person-outline" }}
                    label="TEACHER"
                    data={[{
                        value: typeof occasion.teacherId === "object" ? occasion.teacherId.name : "Unknown Teacher",
                        onPressFunction: () => console.log("Teacher clicked:", occasion.teacherId),
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "location-outline" }}
                    label="CLASSROOM"
                    data={[{
                        value: typeof occasion.classroomId === "object" ? occasion.classroomId.name : "Unknown Classroom",
                        onPressFunction: () => console.log("Classroom clicked:", occasion.classroomId),
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "time-outline" }}
                    label="TIME"
                    data={[{
                        value: `${occasion.dayId}: ${occasion.startTime} - ${occasion.endTime}`,
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "people-outline" }}
                    label="GROUPS"
                    data={
                        occasion.groupIds?.length > 0
                            ? occasion.groupIds.map((group) => ({
                                value: typeof group === "object" ? group.name : "Unknown Group",
                                onPressFunction: () => console.log("Group clicked:", group),
                            }))
                            : [{ value: "No Groups" }]
                    }
                />


            </ScrollView>


        </SafeAreaWrapper>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subjectCard: {
        alignItems: "center",
        backgroundColor: colors.primary,

    },
    contentContainer: {
        padding: 16
    }
});

export default OccasionInfoScreen;
