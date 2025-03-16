import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import ActiveAttendanceCard from '../components/ActiveOccasionCard';
import NextOccasionCard from '../components/NextOccasionCard';
import TimelineOccasionCard from '../components/TimelineOccasionCard';

const UpcomingTab = ({ studentsActiveAttendances, occasions, setRefresh, occasionInstances }) => {
    if (!studentsActiveAttendances) {
        return <Text>Loading attendances...</Text>;
    }

    return (
        <ScrollView>
            {studentsActiveAttendances.length > 0 ? (
                studentsActiveAttendances.map((attendance) => {
                    const occasion = occasions.find((occ) => occ._id === attendance.occasionId);
                    return (
                        <View key={attendance.occasionId}>
                            <ActiveAttendanceCard
                                attendance={attendance}
                                occasion={occasion}
                                setRefresh={setRefresh}
                            />
                        </View>
                    );
                })
            ) : (
                <View>
                    <NextOccasionCard occasions={occasionInstances} setRefresh={setRefresh} />
                </View>
            )}
            <View>
                <TimelineOccasionCard occasions={occasionInstances} />
            </View>
        </ScrollView>
    );
};

export default UpcomingTab;
