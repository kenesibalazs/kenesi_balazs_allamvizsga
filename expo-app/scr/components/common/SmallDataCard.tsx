import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../styles/theme';
interface SmallDataCardProps {
    leading?: string | { iconName: string };
    label?: string;
    data: {
        topLabel?: string;
        value: string;
        bottomLabel?: string;
        abbsenceLabel?: string;
        onPressFunction?: () => void;
        present?: boolean;

    }[];

    showWarning?: boolean;
    warningMessage?: string;
    warningFunction?: () => void;
    showAbsence?: boolean;

}

const SmallDataCard: React.FC<SmallDataCardProps> = ({
    leading,
    label,
    data,
    showWarning,
    warningMessage = "No data available.",
    warningFunction,
    showAbsence: showAbsence = false
}) => {

    const isLabelArray = Array.isArray(label);
    const labelsArray = isLabelArray ? label : [label];

    return (
        <View style={styles.infoCard}>
            <View style={styles.infoRow}>
                {typeof leading === 'string' ? (
                    <Text style={styles.leadingText}>{leading}</Text>
                ) : (
                    <Ionicons
                        name={leading?.iconName || 'information-circle-outline'}
                        size={18}
                        color="#067BC2"
                        style={styles.infoIcon}
                    />
                )}

                <View style={styles.infoSeparator} />

                <View style={styles.infoCardDetails}>
                    {label && <Text style={styles.label}>{label}</Text>}


                    {showWarning ? (
                        <TouchableOpacity
                            style={styles.warningButton}
                            onPress={warningFunction || (() => console.warn(`Warning: ${warningMessage}`))}
                        >
                            <Ionicons name="alert-circle-outline" size={18} color="red" />
                            <Text style={styles.warningText}>{warningMessage}</Text>
                        </TouchableOpacity>
                    ) : (data &&
                        data.map((item, index) => (
                            <View style={{ marginBottom: index < data.length - 1 ? 16 : 0 }}
                                key={index}
                            >
                                {item.topLabel && <Text style={styles.topLabel}>{item.topLabel}</Text>}
                                <TouchableOpacity
                                    key={index}
                                    style={styles.valueRow}
                                    onPress={item.onPressFunction}
                                    disabled={!item.onPressFunction}
                                >

                                    <Text style={styles.infoText}>{item.value}</Text>



                                    {item.abbsenceLabel &&
                                        item.abbsenceLabel === 'present' && showAbsence &&
                                        <View style={styles.presentContainer}>
                                            <Ionicons name="checkmark-circle-outline" size={18} color="#00FF00" />
                                            <Text style={styles.presentText}>Present</Text>
                                        </View>
                                    }
                                    {item.abbsenceLabel && showAbsence &&
                                        item.abbsenceLabel === 'absent' &&
                                        <View style={styles.absentContainer}>
                                            <Ionicons name="alert-circle-outline" size={18} color="red" />
                                            <Text style={styles.absentText}>Absent</Text>
                                        </View>
                                    }

                                    {item.onPressFunction && (
                                        <Ionicons name="chevron-forward-outline" size={18} color="#A9A9A9" />
                                    )}
                                </TouchableOpacity>




                            </View>



                        ))
                    )}
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    infoCard: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.borderRadius.large,
        padding: Theme.padding.medium,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leadingText: {
        fontSize: Theme.fontSize.small,
        textAlign: "center",
        justifyContent: "center",
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.regular,
        width: 40,

    },
    infoIcon: {
        backgroundColor: "rgba(6, 123, 255, 0.2)",
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.full,
    },
    infoSeparator: {
        width: 2,
        height: "100%",
        backgroundColor: Theme.colors.borderColor,
        marginHorizontal: Theme.margin.inbetween,
    },
    infoCardDetails: {
        flex: 1,
    },
    label: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.myblue,
        fontFamily: Theme.fonts.regular,
    },

    topLabel: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.myblue,
        fontFamily: Theme.fonts.regular,
    },

    bottomLabel: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.myblue,
        fontFamily: Theme.fonts.regular,
    },
    infoText: {
        flex: 1,
        fontSize: Theme.fontSize.large,
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.bold,
    },

    valueRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Theme.padding.extraSmall,
    },
    warningButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Theme.margin.small,
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.medium,
        backgroundColor: "rgba(255, 0, 0, 0.1)",
    },
    warningText: {
        color: Theme.colors.red,
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.bold,
        marginLeft: Theme.margin.small,
    },

    presentContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.medium,
    },

    presentText: {
        color: Theme.colors.green,
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.bold,
        marginLeft: Theme.margin.small,
    },

    absentContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: Theme.padding.extraSmall,
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.medium,
    },

    absentText: {
        color: Theme.colors.red,
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.bold,
        marginLeft: Theme.margin.small,
    },


    dataSeparator: {
        height: 1,
        backgroundColor: Theme.colors.borderColor,
        marginVertical: Theme.margin.small
    }

});

export default SmallDataCard;
