import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Occasion } from "../../types/apiTypes";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { OccasionInfoNavigateProps } from '../../types/navigationTypes';
import { SmallDataCard } from "../common";
import { Theme } from "../../styles/theme";

interface TimelineOccasionCardProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}


const TimelineOccasionCard: React.FC<TimelineOccasionCardProps> = ({ occasions }) => {
    const [showAll, setShowAll] = useState(false);
    const now = new Date();

    const filteredOccasions = occasions.filter(occasion => occasion.date > now);
    const groupedOccasions = Object.entries(
        filteredOccasions.reduce((acc, occasion) => {
            const now = new Date();
            const oneWeekLater = new Date();
            oneWeekLater.setDate(now.getDate() + 7);

            let dateKey = "";

            if (occasion.date <= oneWeekLater) {
                const day = occasion.date.getDate();
                const dayName = occasion.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                dateKey = `${day} ${dayName}`;

            } else {
                const day = occasion.date.getDate();
                const month = occasion.date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                dateKey = `${day} ${month}`;
            }


            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(occasion);
            return acc;
        }, {} as Record<string, { occasion: Occasion; date: Date; endDate: Date }[]>)
    );

    const visibleDays = showAll ? groupedOccasions : groupedOccasions.slice(0, 2);

    const navigation = useNavigation<OccasionInfoNavigateProps>();
    const handleMorePress = (occasion: Occasion, startTime: string, endTime: string) => {
        navigation.navigate("OccasionInfo", { occasion, startTime, endTime });
    };

    return (
        <View style={Theme.globalStyles.dataCcontainer}>
            <View style={styles.upcomingHeader}>
                <Text style={styles.upcomingText}>UPCOMING</Text>
                {groupedOccasions.length > 3 && (
                    <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.seeAllButton}>
                        <Text style={styles.seeAllText}>{showAll ? "See less" : "See more"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {visibleDays.map(([date, occasionsForDay], index) => (

                <SmallDataCard
                    key={date + index}
                    leading={date.split(" ").join("\n")}
                    data={occasionsForDay.map(occasion => ({
                        topLabel: `${occasion.occasion.startTime} - ${occasion.occasion.endTime}`,
                        value: typeof occasion.occasion.subjectId === "object" ? occasion.occasion.subjectId.name : "Unknown Subject",
                        onPressFunction: () => handleMorePress(occasion.occasion, occasion.date.toISOString(), occasion.endDate.toISOString())
                    }))}
                />



            ))}

        </View>
    );
};



const styles = StyleSheet.create({

    upcomingHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    seeAllButton: {
        alignItems: "center",
        padding: Theme.padding.small,
    },
    seeAllText: {
        color: Theme.colors.accent,
        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.bold,
    },
    upcomingText: {
        fontSize: Theme.fontSize.large,
        marginBottom: Theme.margin.extraSmall,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.textLight,
    },

});

export default TimelineOccasionCard;
