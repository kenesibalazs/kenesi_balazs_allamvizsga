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
      <Text style={styles.cellLabel}>Participants</Text>
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
        <View
          key={index}
          style={[
            styles.tableHeaderCell,
            index !== sessions.length - 1 && {
              borderRightWidth: 1,
              borderRightColor: Theme.colors.borderColor
            },
          ]}
        >
          <Text style={styles.cellLabel}>{session.month} {session.day}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  tableHeaderContaine: {
    flexDirection: 'row',
    backgroundColor: '#382E34',
    justifyContent: 'space-between',
  },

  tableHeaderCellFirst: {
    width: 140,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: Theme.colors.borderColor
  },

  tableHeaderCell: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",

  },
  cellLabel: {
    fontSize: Theme.fontSize.small,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.text.light,
    textAlign: "center",
  },

});

export default HistoryTableHeader;
