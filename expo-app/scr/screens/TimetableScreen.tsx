import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useOccasions from '../hooks/useOccasions';
import { useAuth } from '../context/AuthContext';

const TimetableScreen = () => {

    const { userData, logout } = useAuth();

    const { occasions, fetchOccasionsByIds } = useOccasions();

    if (!userData) {
        logout();
        return null;
    }

    useEffect(() => {
        const occasionIds = userData.occasionIds.map(id => id.toString()); 
        fetchOccasionsByIds(occasionIds);
       
    }, [userData]);
  



    return (
        <View style={styles.container}>
            <Text>Timetable Screen</Text>
            <Text>
                {occasions.map(occasion => occasion._id)}
            </Text>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TimetableScreen;
