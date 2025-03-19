import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface TimeDisplayProps {
    title: string;
    targetTime: string;
    isElapsed?: boolean;
    showDays?: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ title, targetTime, isElapsed = true, showDays = false }) => {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const target = new Date(targetTime).getTime();
            const diffMs = isElapsed ? now - target : target - now;

            if (!isElapsed && diffMs <= 0) {
                setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Countdown reached zero
                return;
            }

            setTime({
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetTime, isElapsed]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
            <View style={styles.timeContainer}>
                {showDays &&
                    <>
                        <TimeBox value={time.days} label="DAYS" />
                        <Separator />
                    </>
                }
                <TimeBox value={time.hours} label="HRS" />
                <Separator />
                <TimeBox value={time.minutes} label="MINS" />
                {!showDays && (
                    <>
                        <Separator />
                        <TimeBox value={time.seconds} label="SECS" />
                    </>
                )}
            </View>
        </View>
    );
};

const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <View style={styles.timeBox}>
        <Text style={styles.timeValue}>{value}</Text>
        <Text style={styles.timeLabel}>{label}</Text>
    </View>
);

const Separator = () => <View style={styles.separator} />;

import { Theme} from "../../styles/theme";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 8,
    },
    title: {
        textAlign: "center",
        color: Theme.colors.textLight,
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: 'JetBrainsMono-Bold',
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeBox: {
        alignItems: "center",
        marginHorizontal: 16,
        padding: 8,
    },
    timeValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: Theme.colors.textLight,
        fontFamily: 'JetBrainsMono-Bold',
    },
    timeLabel: {
        fontSize: 14,
        color: Theme.colors.textLight,
        fontFamily: 'JetBrainsMono-Bold',
    },
    separator: {
        width: 2,
        height: 40,
        backgroundColor: Theme.colors.textLight,
    },
});

export default TimeDisplay;
