import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Occasion, Attendance } from "./apiTypes"; 

export type RootStackParamList = {
    OccasionInfo: { occasion: Occasion, startTime: string, endTime: string };
    ActiveAttendance: {attendance: Attendance}; 
    OccasionHistory: {occasion: Occasion};
    TimelineOccasion: { occasion: Occasion; date: Date; endDate: Date }[];
    
};

export type OccasionInfoScreenRouteProp = RouteProp<RootStackParamList, "OccasionInfo">;
export type OccasionInfoNavigateProps = StackNavigationProp<RootStackParamList, "OccasionInfo">;

export type ActiveAttendanceScreenRouteProp = RouteProp<RootStackParamList, "ActiveAttendance">;
export type ActiveAttendanceNavigateProps = StackNavigationProp<RootStackParamList, "ActiveAttendance">;

export type OccasionHistoryScreenRouteProp = RouteProp<RootStackParamList, "OccasionHistory">;
export type OccasionHistoryNavigateProps = StackNavigationProp<RootStackParamList, "OccasionHistory">;

