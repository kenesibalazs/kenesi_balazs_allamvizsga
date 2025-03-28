import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Occasion } from '../types/apiTypes';
import { Theme } from '../styles/theme';
import { Header, SafeAreaWrapper } from '../components/common';
import { useComments } from '../hooks/useComment';
import { useAuth } from '../context/AuthContext';

import { AddCommentScreenRouteProp } from '../types/navigationTypes';
import { useNavigation, useRoute } from '@react-navigation/native';


const AddCommentScreen: React.FC = () => {
    const { userData } = useAuth();

    const route = useRoute<AddCommentScreenRouteProp>();
    const { occasions } = route.params;
    const { addComment, loading, error } = useComments();
    const navigation = useNavigation();

    if (!userData) {
        return null;
    }

    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [selectedOccasionId, setSelectedOccasionId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'COMMENT' | 'TEST' | 'CANCELED'>('COMMENT');
    const [activationDate, setActivationDate] = useState('');
    const [commentText, setCommentText] = useState('');

    const groupedOccasions = occasions.reduce((groups, occasion) => {
        const subjectId = typeof occasion.subjectId === 'string' ? 'Unknown Subject' : occasion.subjectId.name;
        if (!groups[subjectId]) {
            groups[subjectId] = [];
        }
        groups[subjectId].push(occasion);
        return groups;
    }, {} as Record<string, Occasion[]>);

    const handleSubjectSelect = (subjectName: string) => {
        setSelectedSubjectId(subjectName);
        setSelectedOccasionId(null);
    };

    const handleOccasionSelect = (occasionId: string) => {
        setSelectedOccasionId((prev) => (prev === occasionId ? null : occasionId));
    };

    const handleAddComment = async () => {
        if (!selectedOccasionId || !commentText.trim()) {
            console.error("❌ Missing required fields!");
            return;
        }

        try {
            await addComment(selectedOccasionId, selectedType, commentText, userData._id);

            if (!error) {
                navigation.goBack();
            }
        } catch (err) {
            console.error("❌ Error submitting comment:", err);
        }
    };

    const handleSubmitEditing = () => {
        Keyboard.dismiss();
        console.log(commentText);
    };

    return (
        <SafeAreaWrapper>

            <Header
                title="Add Comment"
                leftIcon={"arrow-back"}
                onLeftPress={() => navigation.goBack()}
                rightIcon={"add"}
                onRightPress={handleAddComment}
                rightColored
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.modalContainer}
                    keyboardShouldPersistTaps="handled"
                >


                    <Text style={styles.label}>Select Subject</Text>
                    <View style={styles.filterButtons}>
                        {Object.keys(groupedOccasions).map((subjectName) => (
                            <TouchableOpacity
                                key={subjectName}
                                onPress={() => handleSubjectSelect(subjectName)}
                                style={[
                                    styles.filterButton,
                                    selectedSubjectId === subjectName && styles.activeFilterButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedSubjectId === subjectName && styles.activeFilterButtonText,
                                    ]}
                                >
                                    {subjectName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedSubjectId && (
                        <>
                            <Text style={styles.label}>Select Occasion</Text>
                            <View style={styles.filterButtons}>
                                {groupedOccasions[selectedSubjectId].map((occasion) => (
                                    <TouchableOpacity
                                        key={occasion._id}
                                        onPress={() => handleOccasionSelect(occasion._id)}
                                        style={[
                                            styles.filterButton,
                                            selectedOccasionId === occasion._id && styles.activeFilterButton,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.filterButtonText,
                                            selectedOccasionId === occasion._id && styles.activeFilterButtonText,
                                        ]}>
                                            {typeof occasion.subjectId === 'string'
                                                ? 'Unknown Subject'
                                                : occasion.subjectId.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <Text style={styles.label}>Select Type</Text>
                    <View style={styles.filterButtons}>
                        {['COMMENT', 'TEST', 'CANCELED'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setSelectedType(type as 'COMMENT' | 'TEST' | 'CANCELED')}
                                style={[
                                    styles.filterButton,
                                    selectedType === type && styles.activeFilterButton,
                                ]}
                            >
                                <Text style={[styles.filterButtonText, selectedType === type && styles.activeFilterButtonText]}>
                                    {type.toLowerCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter your comment"
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        keyboardAppearance="dark"
                        onSubmitEditing={handleSubmitEditing}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({


    modalContainer: {
        flex: 1,
        backgroundColor: Theme.colors.primary,
        padding: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        padding: 10,
        marginBottom: 16,
        borderRadius: Theme.borderRadius.large,
    },
    textArea: {
        flex: 1,
        textAlignVertical: 'top',
        color: Theme.colors.text.light,
        padding: 16,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        marginBottom: 10,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
    },
    filterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: Theme.borderRadius.large,
        marginRight: 7,
        marginBottom: 7,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
    },
    activeFilterButton: {
        borderColor: Theme.colors.myblue,
    },
    filterButtonText: {
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
    },
    activeFilterButtonText: {
        fontFamily: Theme.fonts.extraBold,
    },
});

export default AddCommentScreen;
