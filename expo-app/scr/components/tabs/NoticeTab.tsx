import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from "../../context/AuthContext";
import { Theme } from "../../styles/theme";
import { Occasion } from "../../types/apiTypes";
import { useComments } from "../../hooks/useAddComment";
import { AddCommentNavigateProps } from '../../types/navigationTypes';

const timeAgo = (timeId: string): string => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timeId).getTime();
    const minutes = Math.floor(timeDiff / 60000);
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
    const { comments, fetchCommentsByOccasionIds, loadMoreComments, loading, hasMore, setPage, setHasMore, setComments } = useComments();  // Destructure setters here
    const navigation = useNavigation<AddCommentNavigateProps>();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (occasions.length > 0) {
            fetchCommentsByOccasionIds(occasions.map((occasion) => occasion._id));
        }
    }, [occasions]);

    const uniqueComments = Array.from(new Map(comments.map((c) => [c._id, c])).values());

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        setPage(1);  
        setHasMore(true); 

        await fetchCommentsByOccasionIds(occasions.map((occasion) => occasion._id));

        setRefreshing(false);
    }, [fetchCommentsByOccasionIds, occasions, setPage, setHasMore]);



    const onAddCommentPress = () => {
        navigation.navigate("AddCommenScreen", { occasions });
    };



    const renderComment = ({ item }) => (
        <View key={item._id} style={styles.commentContainer}>
            <View style={styles.userContainer}>
                <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.userImage} />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.nameCell}>
                        {typeof item.creatorId === 'object' ? item.creatorId.name : 'Unknown Creator'}
                    </Text>
                    <Text style={styles.timeCell}>
                        • {timeAgo(item.createdAt)}
                    </Text>
                </View>
            </View>

            <View style={styles.commentContent}>
                <Text style={styles.commentTitle}>
                    {typeof item?.occasionId?.subjectId === 'object' ? item.occasionId.subjectId.name : 'Unknown Subject'} - {item.type}
                </Text>
                <Text style={styles.comment}>{item.comment}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={20} color={Theme.colors.text.light} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="arrow-up-outline" size={20} color={Theme.colors.text.light} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="arrow-down-outline" size={20} color={Theme.colors.text.light} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={uniqueComments}
                renderItem={renderComment}
                keyExtractor={(item, index) => item._id ? item._id : `comment-${index}`}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Theme.colors.myblue]}
                        tintColor={Theme.colors.myblue}
                    />
                }
                onEndReached={() => {
                    if (hasMore) {
                        loadMoreComments();
                    } else {
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color={Theme.colors.primary} /> : null}
            />

            <TouchableOpacity style={styles.floatingButton} onPress={onAddCommentPress}>
                <Ionicons name="add" size={30} color={Theme.colors.textLight} />
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
    commentTitle: {
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
