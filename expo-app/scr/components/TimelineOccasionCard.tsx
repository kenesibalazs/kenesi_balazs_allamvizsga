import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Occasion } from "../types/apiTypes";

interface TimelineOccasionCardProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}

const TimelineOccasionCard: React.FC<TimelineOccasionCardProps> = ({ occasions }) => {
    const now = new Date();

    const filteredOccasions = occasions.filter(occasion => occasion.date > now);

    const groupedOccasions = filteredOccasions.reduce((acc, occasion) => {
        const dateKey = occasion.date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }).toUpperCase();

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(occasion);
        return acc;
    }, {} as Record<string, { occasion: Occasion; date: Date; endDate: Date }[]>);

    return (
        <View style={styles.container}>
            {Object.entries(groupedOccasions).map(([date, occasionsForDay]) => (
                <View key={date} style={styles.dateGroup}>
                    <Text style={styles.dateHeader}>{date.split(" ").join("\n")}</Text>
                    <View style={styles.occasionsContainer}>
                        {occasionsForDay.map((occasion, index) => (
                            <View key={index} style={styles.occasionCard}>

                                <Text style={styles.occasionTitle}>
                                    {typeof occasion.occasion.subjectId === 'object' ? occasion.occasion.subjectId.name : 'Unknown Subject'}
                                </Text>
                                <Text style={styles.occasionTime}>{occasion.occasion.startTime} - {occasion.occasion.endTime}</Text>
                            </View>
                        ))}

                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 16,
        
    },
    dateGroup: {
        flexDirection: "row",
        padding: 6,
       
        gap: 16,

    },
    dateHeader: {
        fontSize: 14,
        fontWeight: 500,
        textAlign: "center",
        justifyContent: "flex-start",
        color: "#4CAF50",
        marginBottom: 8,
    },

    occasionsContainer: {
        flex: 1,
        borderBottomWidth: .5,
        borderBottomColor: '#e0e0e0',
    },
    occasionCard: {
        padding: 12,
        width: "100%",
        backgroundColor: "#f1f3f5",
        borderRadius: 16,
        marginBottom: 10,

    },
    occasionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#68b0ff",
        marginBottom: 4,
    },
    occasionTime: {
        fontSize: 14,
        color: "#555",
    },
});

export default TimelineOccasionCard;
