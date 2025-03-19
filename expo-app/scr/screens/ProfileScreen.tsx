import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Header, SafeAreaWrapper } from '../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SmallDataCard } from '../components/common';


const ProfileScreen: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaWrapper>
            <Header title="Profile" />

            <View style={styles.profileCard}>
                <Image
                    source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }}
                    style={styles.userImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userType}>{userData.type}</Text>
                    <Text style={styles.neptunCode}>Neptun Code: {userData.neptunCode}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <SmallDataCard
                    leading={{ iconName: "school-outline" }}
                    label="UNIVERSITY"
                    value={
                        userData.universityId && typeof userData.universityId === "object" && "name" in userData.universityId
                            ? userData.universityId.name
                            : "Unknown University"
                    }
                    onChevronPress={(item) => {
                        if (typeof item === "string") {
                            const selectedUniversity =
                                userData.universityId && typeof userData.universityId === "object" && "name" in userData.universityId && userData.universityId.name === item
                                    ? userData.universityId
                                    : null;

                            console.log("University clicked:", selectedUniversity);
                        }
                    }}
                />


                <SmallDataCard
                    leading={{ iconName: "book-outline" }}
                    label="MAJORS"
                    value={userData.majors.length > 0
                        ? userData.majors.map((major) => typeof major === "object" && "name" in major ? major.name : "Unknown Major")
                        : "No majors assigned"}
                    onChevronPress={(item) => {
                        if (typeof item === "string") {
                            const selectedMajor = userData.majors.find(
                                (major) => typeof major === "object" && "name" in major && major.name === item
                            );
                            console.log("Major clicked:", selectedMajor);
                        }
                    }}
                />

                <SmallDataCard
                    leading={{ iconName: "people-outline" }}
                    label="GROUPS"
                    value={
                        userData.groups.length > 0
                            ? userData.groups.map((group) => typeof group === "object" && "name" in group ? group.name : "Unknown Group")
                            : "No groups assigned"
                    }
                    onChevronPress={userData.groups.length > 0 ? (item) => {
                        const selectedGroup = userData.groups.find(
                            (group) => typeof group === "object" && "name" in group && group.name === item
                        );
                        console.log("Group clicked:", selectedGroup);
                    } : undefined}
                    showWarning={userData.groups.length === 0}
                    warningMessage="Please update"
                    warningFunction={() => alert("Redirecting to group settings...")}
                />



                {/* Logout Button */}

            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userType: {
        fontSize: 14,
        color: '#666',
    },
    neptunCode: {
        fontSize: 14,
        color: '#999',
    },

    contentContainer: {
        padding: 16
    },


    logoutButton: {
        marginTop: 30,
        backgroundColor: '#D9534F',
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
