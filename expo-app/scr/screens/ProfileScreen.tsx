import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as Animatable from 'react-native-animatable';

import { Header, SafeAreaWrapper, UserProfileCard , SmallDataCard} from '../components/common';
import { Theme } from '../styles/theme';


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
            <Header
                title="My Profile"
                rightIcon="settings-outline"
                onRightPress={() => console.log("Settings Pressed")}
            />

            <Animatable.View animation="fadeInDown" duration={600}>
                <UserProfileCard
                    userId={userData._id}
                    name={userData.name}
                    type={userData.type}
                    neptunCode={userData.neptunCode}
                    imageUri={userData.profileImage}
                />
            </Animatable.View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <Animatable.View animation="fadeInUp" duration={500} delay={100}>
                    <SmallDataCard
                        leading={{ iconName: "school-outline" }}
                        label="UNIVERSITY"
                        data={[{
                            value: userData.universityId && typeof userData.universityId === "object" && "name" in userData.universityId
                                ? userData.universityId.name
                                : "Unknown University",
                        }]}
                    />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={500} delay={200}>
                    <SmallDataCard
                        leading={{ iconName: "book-outline" }}
                        label="MAJORS"
                        data={
                            (userData.majors ?? []).length > 0
                                ? userData.majors.map((major) => ({
                                    value: major?.name || "Unknown Major",
                                    onPressFunction: () => console.log("Major clicked:", major),
                                }))
                                : [{ value: "No majors assigned" }]
                        }
                        showWarning={userData.majors.length === 0}
                        warningMessage="Please update you majors"
                        warningFunction={() => alert("Redirecting to major settings...")}
                    />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={500} delay={300}>
                    <SmallDataCard
                        leading={{ iconName: "people-outline" }}
                        label="GROUPS"
                        data={
                            (userData.groups ?? []).length > 0
                                ? userData.groups.map((group) => ({
                                    value: group?.name || "Unknown Group",
                                    onPressFunction: () => console.log("Group clicked:", group),
                                }))
                                : [{ value: "No groups assigned" }]
                        }
                        showWarning={userData.groups.length === 0}
                        warningMessage="Please update you groups"
                        warningFunction={() => alert("Redirecting to group settings...")}
                    />
                </Animatable.View>


                <Animatable.View animation="fadeInUp" duration={500} delay={400}>
                    <SmallDataCard
                        data={[
                            { value: "Log out", onPressFunction: handleLogout },
                        ]}
                    />
                </Animatable.View>

            </ScrollView>

        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({

    container: {
        padding: Theme.padding.medium,
    },

});

export default ProfileScreen;
