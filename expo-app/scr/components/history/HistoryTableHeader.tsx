import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Theme } from "../../styles/theme";

interface HistoryTableHeaderProps {
  sessions: { month: string; day: string }[];
  headerScrollRef: React.RefObject<ScrollView>;
  handleHeaderScroll: (event: any) => void;
}

const HistoryTableHeader: React.FC<HistoryTableHeaderProps> = ({ sessions, headerScrollRef, handleHeaderScroll }) => (
  <View style={styles.tableHeaderContaine}>
    <View style={styles.tableHeaderCellFirst}>
      <Text style={styles.participantsText}>Participants</Text>
    </View>

    <ScrollView
      horizontal
      ref={headerScrollRef}
      onScroll={handleHeaderScroll}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {sessions.map((session, index) => (
        <View key={index} style={styles.tableHeaderCell}>
          <Text style={styles.monthText}>{session.month}</Text>
          <Text style={styles.dayText}>{session.day}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  tableHeaderContaine: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  tableHeaderCellFirst: {
    width: 150,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.borderRadius.inbetween,
    backgroundColor: Theme.colors.primary,
    borderWidth: 1,
    borderColor: Theme.colors.borderColor,
  },
  tableHeaderCell: {
    width: 55,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Theme.margin.extraSmall,
    borderRadius: Theme.borderRadius.inbetween,
    backgroundColor: Theme.colors.primary,
    borderWidth: 1,
    borderColor: Theme.colors.borderColor,
  },
  monthText: {
    fontSize: Theme.fontSize.small,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.text.light,
    textAlign: "center",
  },
  dayText: {
    fontSize: Theme.fontSize.extraExtraLarge,
    fontFamily: Theme.fonts.extraBold,
    color: Theme.colors.textLight,
    textAlign: "center",
  },
  participantsText: {
    fontSize: Theme.fontSize.medium,
    fontFamily: Theme.fonts.extraBold,
    color: Theme.colors.textLight,
    textAlign: "center",
  },
});

export default HistoryTableHeader;
