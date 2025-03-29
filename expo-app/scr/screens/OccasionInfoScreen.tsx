import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigationTypes';

import { OccasionInfoScreenRouteProp } from '../types/navigationTypes';
import { Header, SafeAreaWrapper, TimeDisplay, SmallDataCard } from '../components/common';
import { Theme } from "../styles/theme";
import { Classroom, Subject, User } from "../types";

const OccasionInfoScreen: React.FC = () => {
    const route = useRoute<OccasionInfoScreenRouteProp>();
    const { occasion, startTime, endTime } = route.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
                <TimeDisplay title="Time Until Start" targetTime={new Date(startTime).toISOString()} isElapsed={false} showDays={true} />
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
                        onPressFunction: () => navigation.navigate("SubjectInfo", { subject: occasion.subjectId as Subject }),
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "person-outline" }}
                    label="TEACHER"
                    data={[{
                        value: typeof occasion.teacherId === "object" ? occasion.teacherId.name : "Unknown Teacher",
                        onPressFunction: () => navigation.navigate("UserInfo", { user: occasion.teacherId as User }),
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "location-outline" }}
                    label="CLASSROOM"
                    data={[{
                        value: typeof occasion.classroomId === "object" ? occasion.classroomId.name : "Unknown Classroom",
                        onPressFunction: () => navigation.navigate("ClassroomInfo", { classroom: occasion.classroomId as Classroom }),
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
                                onPressFunction: () => navigation.navigate("GroupInfo", { group }),
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
        backgroundColor: Theme.colors.primary,
    },
    contentContainer: {
        padding: Theme.padding.medium,
    }
});

export default OccasionInfoScreen;
