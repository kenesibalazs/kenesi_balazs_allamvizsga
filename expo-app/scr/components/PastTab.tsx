import React from 'react';
import { ScrollView } from 'react-native';
import TimelineOccasionCard from '../components/TimelineOccasionCard';

const HistoryTab = ({ occasionInstances }) => {
    return (
        <ScrollView>
            <TimelineOccasionCard occasions={occasionInstances} />
        </ScrollView>
    );
};

export default HistoryTab;
