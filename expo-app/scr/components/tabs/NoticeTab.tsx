import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from "../../context/AuthContext";
import { Theme } from "../../styles/theme";
import { Occasion } from "../../types/apiTypes";

import { AddCommentNavigateProps } from '../../types/navigationTypes';

const NoticesTab = ({ occasions }: { occasions: Occasion[] }) => {
    const { userData } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<AddCommentNavigateProps>();

    const onAddCommentPress = (occasions: Occasion[]) => {
        navigation.navigate("AddCommenScreen", { occasions });
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>

                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => onAddCommentPress(occasions)}
            >
                <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: Theme.colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1000,
    },
    floatingButtonText: {
        fontSize: 30,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the halo effect
        position: 'absolute', // Ensure the modal is on top of everything
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure it appears above other elements
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        minWidth: 200,
    },
});

export default NoticesTab;
