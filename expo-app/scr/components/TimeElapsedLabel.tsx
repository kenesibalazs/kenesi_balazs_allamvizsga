import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeElapsedLabelProps {
    startTime: string; // Can be changed to Date if needed
}

const TimeElapsedLabel: React.FC<TimeElapsedLabelProps> = ({ startTime }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const start = new Date(startTime).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            setElapsedTime(Math.floor((now - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const getTimeParts = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return { hours, minutes, secs };
    };

    const { hours, minutes, secs } = getTimeParts(elapsedTime);

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.maintext}>{hours}</Text>
                <Text style={styles.text}>HRS</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.item}>
                <Text style={styles.maintext}>{minutes}</Text>
                <Text style={styles.text}>MIN</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.item}>
                <Text style={styles.maintext}>{secs}</Text>
                <Text style={styles.text}>SEC</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12, 
        paddingVertical: 4
    },
    maintext: {
        fontSize: 24,
        fontWeight: '900',
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: 'black',
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: 'grey',
    },

    divider:{
        width: 1,
        height: '75%',
        backgroundColor: 'grey',
    }
});


export default TimeElapsedLabel;
