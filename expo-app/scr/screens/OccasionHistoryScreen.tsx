import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { OccasionHistoryScreenRouteProp } from "../types/navigationTypes";
import { Theme } from "../styles/theme";
import { Header, SafeAreaWrapper } from "../components/common";

const OccasionHistoryScreen: React.FC = () => {
    const route = useRoute<OccasionHistoryScreenRouteProp>();
    const occasion = route.params.occasion;

    return (
        <SafeAreaWrapper>
            <Header title="History" />
            <ScrollView contentContainerStyle={styles.container}>
                
                <Text style={styles.label}>Full Occasion Data:</Text>
                
                <View style={styles.jsonContainer}>
                    <Text style={styles.jsonText}>
                        {JSON.stringify(occasion, null, 2)}
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: Theme.colors.textLight,
    },
    jsonContainer: {
        backgroundColor: Theme.colors.primaryTransparent,
        padding: 12,
        borderRadius: 6,
    },
    jsonText: {
        fontSize: 14,
        color: Theme.colors.textLight,
        fontFamily: "monospace",
    },
});

export default OccasionHistoryScreen;
