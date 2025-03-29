import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GroupInfoScreenRouteProp } from '../types/navigationTypes';
import { Header, SmallDataCard, SafeAreaWrapper } from '../components/common';

const GroupInfoScreen = () => {
  const route = useRoute<GroupInfoScreenRouteProp>();
  const { group } = route.params;

  return (
    <SafeAreaWrapper>
      <Header title="Group Info" leftIcon="arrow-back" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SmallDataCard label="Name" data={[{ value: group.name }]} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default GroupInfoScreen;