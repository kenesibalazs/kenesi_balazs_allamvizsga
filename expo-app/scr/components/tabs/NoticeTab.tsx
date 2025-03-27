import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from "../../context/AuthContext";
import { Theme } from "../../styles/theme";
import { Occasion } from "../../types/apiTypes";

import { AddCommentNavigateProps } from '../../types/navigationTypes';

const timeAgo = (timeId: string): string => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timeId).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
};

const NoticesTab = ({ occasions }: { occasions: Occasion[] }) => {
    const { userData } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<AddCommentNavigateProps>();

    const onAddCommentPress = (occasions: Occasion[]) => {
        navigation.navigate("AddCommenScreen", { occasions });
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {occasions.map((occasion) => (
                    <View key={occasion._id}>
                        {occasion.comments
                            .sort((a, b) => {
                                const timeA = new Date(a.timeId).getTime();
                                const timeB = new Date(b.timeId).getTime();
                                return timeB - timeA;
                            })
                            .map((comment) => (
                                <View key={comment._id} style={styles.commentContainer}>
                                    <View style={styles.userContainer}>
                                        <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.userImage} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.nameCell}>
                                                <Text>{typeof comment.creatorId === 'object' ? comment.creatorId.name : 'Unknown Creator'}
                                                </Text>
                                            </Text>
                                            <Text style={styles.timeCell}>
                                                • {timeAgo(comment.timeId)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.commentContent}>
                                        <Text style={styles.comentTitle}>
                                            {typeof occasion?.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'} - {comment.type}
                                        </Text>
                                        <Text style={styles.comment}>{comment.comment}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <TouchableOpacity>
                                                <Ionicons
                                                    name="heart-outline"
                                                    size={20}
                                                    color={Theme.colors.text.light}
                                                />

                                            </TouchableOpacity>

                                            <TouchableOpacity>
                                                <Ionicons
                                                    name="arrow-up-outline"
                                                    size={20}
                                                    color={Theme.colors.text.light}
                                                />

                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Ionicons
                                                    name="arrow-down-outline"
                                                    size={20}
                                                    color={Theme.colors.text.light}
                                                />

                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            ))}
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => onAddCommentPress(occasions)}
            >
                <Ionicons
                    name="add"
                    size={30}
                    color={Theme.colors.textLight}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: Theme.colors.myblue,
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



    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    nameCell: {
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        marginLeft: Theme.margin.small
    },

    timeCell: {
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.text.light,
        marginLeft: Theme.margin.small
    },

    userImage: {
        width: 28,
        height: 28,
        borderRadius: 16,
        marginRight: 4,
    },

    commentContainer: {
        flexDirection: 'column',
        padding: Theme.padding.medium,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.borderColor,
    },




    comentTitle: {
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
        marginTop: Theme.margin.small,
    },


    commentContent: {
        marginLeft: 40,
        gap: 12,

    },

    comment: {
        color: Theme.colors.textLight,
    },
});

export default NoticesTab;
