import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../styles/theme';

interface Group {
    _id: string;
    name: string;
}

interface ExtendableDataCardProps {
    leading?: string | { iconName: string };
    label?: string;
    data: {
        subjectId: string;
        subjectName: string;
        occasions: {
            occasionId: string;
            startTime: string;
            endTime: string;
            groups: string[] | Group[];
            onClickFunction?: () => void;
        }[];
    }[];

    showWarning?: boolean;
    warningMessage?: string;
    warningFunction?: () => void;
    showAbsence?: boolean;
}


const ExtendableDataCard: React.FC<ExtendableDataCardProps> = ({
    leading,
    label,
    data,
    showWarning,
    warningMessage = "No data available.",
    warningFunction,
    showAbsence = false,
}) => {
    const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

    const toggleSubjectExpand = (subjectId: string) => {
        setExpandedSubjectId((prevState) => (prevState === subjectId ? null : subjectId));
    };

    return (
        <View style={styles.infoCard}>
            <View style={styles.infoRow}>
                {/* {typeof leading === 'string' ? (
                    <Text style={styles.leadingText}>{leading}</Text>
                ) : (
                    <Ionicons
                        name={leading?.iconName || 'information-circle-outline'}
                        size={18}
                        color="#067BC2"
                        style={styles.infoIcon}
                    />
                )}

                <View style={styles.infoSeparator} /> */}

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
                    ) : (
                        data &&
                        data.map((item, index) => (
                            <View key={index} style={{ marginBottom: index < data.length - 1 ? 16 : 0 }}>
                                <TouchableOpacity
                                    style={styles.valueRow}
                                    onPress={() => toggleSubjectExpand(item.subjectId)}
                                >
                                    <Text style={styles.infoText}>{item.subjectName}</Text>
                                    <Ionicons
                                        name={expandedSubjectId === item.subjectId ? 'chevron-up' : 'chevron-down'}
                                        size={18}
                                        color="#A9A9A9"
                                    />
                                </TouchableOpacity>

                                {expandedSubjectId === item.subjectId && (
                                    <View 
                                    style={styles.occasionsContainer}>

                                        {item.occasions.map((occasion) => (

                                            <TouchableOpacity
                                                onPress={occasion.onClickFunction}
                                            >
                                                <View key={occasion.occasionId} style={styles.occasionCard}>

                                                    <View>
                                                        <View style={styles.occasionDetails}>
                                                            <Text style={styles.occasionHeaderText}>
                                                                Elöadás
                                                            </Text>
                                                            <Text style={styles.occasionText}>
                                                                {Array.isArray(occasion.groups)
                                                                    ? occasion.groups.map((group) => (typeof group === 'string' ? group : group.name)).join('\n')
                                                                    : 'No groups available'}
                                                            </Text>
                                                        </View>

                                                    </View>

                                                    <Ionicons name="chevron-forward-outline" size={18} color="#A9A9A9" />

                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </View>
        </View >
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
        textAlign: 'center',
        justifyContent: 'center',
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.regular,
        width: 40,
    },
    infoIcon: {
        backgroundColor: 'rgba(6, 123, 255, 0.2)',
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.full,
    },
    infoSeparator: {
        width: 2,
        height: '100%',
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
    infoText: {
        flex: 1,
        fontSize: Theme.fontSize.large,
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.bold,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Theme.padding.extraSmall,
    },
    occasionsContainer: {
        marginTop: 8,
        paddingLeft: 4,
    },
    occasionCard: {
        backgroundColor: Theme.colors.halsTsansparent,
        padding: 8,
        borderRadius: 8,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Theme.colors.borderColor,
        borderWidth: 1,
    },

    occasionDetails: {
        flexDirection: 'column',
        gap: 4
    },

    occasionHeaderText: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.extraBold,
    },
    occasionText: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.regular,
    },
    occasionButton: {
        backgroundColor: Theme.colors.myblue,
        padding: 8,
        borderRadius: Theme.borderRadius.medium,
        marginTop: 8,
    },
    occasionButtonText: {
        color: Theme.colors.white,
        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.bold,
        textAlign: 'center',
    },
    warningButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Theme.margin.small,
        padding: Theme.padding.small,
        borderRadius: Theme.borderRadius.medium,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    warningText: {
        color: Theme.colors.red,
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.bold,
        marginLeft: Theme.margin.small,
    },
});

export default ExtendableDataCard;
