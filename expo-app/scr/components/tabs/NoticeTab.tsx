import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

import { useAuth } from "../../context/AuthContext";
import { Theme } from "../../styles/theme";
import { Occasion } from "../../types/apiTypes";
import { useComments } from "../../hooks/useComment";
import { AddCommentNavigateProps } from '../../types/navigationTypes';
import { timeAgo } from '../../utils';

const NoticesTab = ({ occasions }: { occasions: Occasion[] }) => {
    const { userData } = useAuth();
    const { comments, fetchCommentsByOccasionIds, loadMoreComments, loading, hasMore, setPage, setHasMore, setComments, voteOnComment } = useComments();
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

    const renderComment = ({ item, index }) => {
        const userVote = item.reactions?.votes.find(v => v.userId === userData?._id);
        const voteCount = (item.reactions?.votes.filter(v => v.type === 'upvote').length || 0) -
            (item.reactions?.votes.filter(v => v.type === 'downvote').length || 0);

        return (
            <Animatable.View
                animation="fadeInUp"
                delay={index * 20}
                duration={400}
                style={styles.commentContainer}
            >
                <View style={styles.headerContainer}>
                    {typeof item.creatorId === 'object' && item.creatorId.profileImage ? (
                      <Image
                        source={{ uri: item.creatorId.profileImage }}
                        style={styles.userImage}
                      />
                    ) : (
                      <View style={[styles.userImage, { backgroundColor: Theme.colors.myblue, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: 'white', fontFamily: Theme.fonts.extraBold }}>
                          {(item.creatorId as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nameCell}>
                            {typeof item.creatorId === 'object' ? item.creatorId.name : 'Unknown Creator'} <Text style={styles.timeCell}>· {timeAgo(item.createdAt)}</Text>
                        </Text>
                        <Text style={styles.commentTitle}>
                            {typeof item?.occasionId?.subjectId === 'object' ? item.occasionId.subjectId.name : 'Unknown Subject'}
                        </Text>
                    </View>
                </View>

                <View style={styles.commentContent}>
                    <Text style={styles.comment}>{item.comment}</Text>
                    <View style={styles.actionsRow}>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity onPress={() => voteOnComment(item._id, userData._id, 'upvote')}>
                                <Ionicons name="arrow-up-outline" size={20} color={userVote?.type === 'upvote' ? '#4CAF50' : Theme.colors.text.light} />
                            </TouchableOpacity>
                            {voteCount !== 0 && (
                                <Text style={{ color: Theme.colors.text.light, fontWeight: 'bold', marginHorizontal: 8 }}>{voteCount}</Text>
                            )}
                            <View style={styles.voteSeparator} />
                            <TouchableOpacity onPress={() => voteOnComment(item._id, userData._id, 'downvote')}>
                                <Ionicons name="arrow-down-outline" size={20} color={userVote?.type === 'downvote' ? 'red' : Theme.colors.text.light} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.repliesContainer}>
                            <TouchableOpacity onPress={() => console.log('Open replies for', item._id)} style={styles.repliesButton}>
                                <Ionicons name="chatbubble-outline" size={20} color={Theme.colors.text.light} />
                                <Text style={styles.repliesCount}>1</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animatable.View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={uniqueComments}
                renderItem={({ item, index }) => renderComment({ item, index })}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Theme.margin.small,
    },
    nameCell: {
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        fontSize: 16,
    },
    timeCell: {
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
        fontSize: 14,
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 100,
        marginRight: 4,
    },
    commentContainer: {
        flexDirection: 'column',
        padding: Theme.padding.medium,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.borderColor,
        backgroundColor: Theme.colors.background,
    },
    commentTitle: {
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.text.light,
        marginTop: 2,
    },
    commentContent: {
        gap: 12,
        paddingLeft: 40,
    },
    comment: {
        color: Theme.colors.textLight,
        fontSize: 15,
        lineHeight: 20,
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.primaryTransparent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    voteSeparator: {
        width: 2,
        height: 20,
        backgroundColor: Theme.colors.borderColor,
        marginHorizontal: 8,
        borderRadius: Theme.borderRadius.full,
    },
    repliesContainer: {
        backgroundColor: Theme.colors.primaryTransparent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    repliesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    repliesCount: {
        color: Theme.colors.text.light,
        fontWeight: 'bold',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});

export default NoticesTab;
