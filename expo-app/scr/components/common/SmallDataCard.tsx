import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SmallDataCardProps {
    leading?: string | { iconName: string };
    label: string;
    value: string | string[];
    onChevronPress?: (item?: string) => void;
    showWarning?: boolean;
    warningMessage?: string;
    warningFunction?: () => void;  // ✅ Function to handle warning button press
}

const SmallDataCard: React.FC<SmallDataCardProps> = ({
    leading,
    label,
    value,
    onChevronPress,
    showWarning,
    warningMessage = "No data available.",
    warningFunction, 
}) => {
    const valuesArray = Array.isArray(value) ? value : [value];

    return (
        <View style={styles.infoCard}>
            <View style={styles.infoRow}>
                {typeof leading === 'string' ? (
                    <Text style={styles.leadingText}>{leading}</Text>
                ) : (
                    <Ionicons
                        name={leading?.iconName || 'information-circle-outline'}
                        size={16}
                        color="#067BC2"
                        style={styles.infoIcon}
                    />
                )}

                <View style={styles.infoSeparator} />

                <View style={styles.infoCardDetails}>
                    <Text style={styles.label}>{label}</Text>

                    {showWarning ? (
                        <TouchableOpacity
                            style={styles.warningButton}
                            onPress={warningFunction || (() => console.warn(`Warning: ${warningMessage}`))}
                        >
                            <Ionicons name="alert-circle-outline" size={18} color="red" />
                            <Text style={styles.warningText}>{warningMessage}</Text>
                        </TouchableOpacity>
                    ) : (
                        valuesArray.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.valueRow}
                                onPress={onChevronPress ? () => onChevronPress(item) : undefined}
                                disabled={!onChevronPress} 
                            >
                                <Text style={styles.infoText}>{item}</Text>
                                {onChevronPress && (
                                    <Ionicons name="chevron-forward-outline" size={16} color="#A9A9A9" />
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    infoCard: {
        backgroundColor: "rgba(6, 123, 194, 0.1)",
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leadingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#067BC2',
        marginRight: 8,
    },
    infoIcon: {
        backgroundColor: "rgba(6, 123, 194, 0.1)",
        padding: 8,
        borderRadius: 50,
    },
    infoSeparator: {
        width: 2,
        height: "60%",
        backgroundColor: "#D0D0D0",
        marginHorizontal: 12,
    },
    infoCardDetails: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#2196F3",
        fontFamily: 'JetBrainsMono-Regular',
    },
    infoText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        fontFamily: 'JetBrainsMono-Bold',
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    warningButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        padding: 6,
        borderRadius: 8,
        backgroundColor: "rgba(255, 0, 0, 0.1)",
    },
    warningText: {
        color: "red",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 5,
    },
});

export default SmallDataCard;
