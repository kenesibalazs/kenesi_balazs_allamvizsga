import React , { useEffect} from 'react';
import { Modal, Animated, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Occasion } from "../types/apiTypes";
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

interface TimetableModalProps {
    modalVisible: boolean;
    instance: Occasion | null;
    closeModal: () => void;
}

const TimetableModal: React.FC<TimetableModalProps> = ({ modalVisible, instance, closeModal }) => {
    const { userData, logout } = useAuth();
    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    const [modalHeight] = React.useState(new Animated.Value(10));

    React.useEffect(() => {
        if (modalVisible) {
            Animated.timing(modalHeight, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(modalHeight, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [modalVisible]);

    return (
        <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={closeModal}
        >
            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        transform: [
                            {
                                translateY: modalHeight.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [600, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Icon name="close" size={22} color="black" />
                    </TouchableOpacity>

                    {instance && (
                        <>
                            <Image
                                source={require("../assets/modalimage.png")}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.modalTextContainer}>
                                <Text style={styles.modalTitle}>
                                    {typeof instance.subjectId === 'object' ? instance.subjectId.name : 'Unknown Subject'}
                                </Text>
                                <Text style={styles.modalTime}>
                                    {instance.startTime} - {instance.endTime}
                                </Text>
                                <Text style={styles.modalTeacher}>
                                    {typeof instance.teacherId === 'object' ? instance.teacherId.name : 'Unknown Teacher'}
                                </Text>
                                <Text style={styles.modalClassroom}>
                                    {instance.classroomId}
                                </Text>
                            </View>
                        </>
                    )}

                    {userData.type === "TEACHER" && (
                        <TouchableOpacity style={styles.addCommentButton} onPress={closeModal}>
                            <Text style={styles.addCommentButtonText}>Add Comment</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 32,
        position: 'relative',
    },

    modalTextContainer: {
    },


    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalTime: {
        fontSize: 14,
        marginBottom: 10,
    },
    modalTeacher: {
        fontSize: 14,
        marginBottom: 10,
    },
    modalClassroom: {
        fontSize: 14,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 20,
    },

    addCommentButton: {
        marginLeft: 'auto',
        padding: 10,
        backgroundColor: '#4A90E2',
        borderRadius: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '50%',
    },
    addCommentButtonText: {
        color: 'white',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,

    },
    closeButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default TimetableModal;
