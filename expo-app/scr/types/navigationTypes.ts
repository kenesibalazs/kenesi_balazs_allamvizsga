import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Occasion } from "./apiTypes"; 

export type RootStackParamList = {
    OccasionInfo: { occasion: Occasion, startTime: string, endTime: string };
};

export type OccasionInfoScreenRouteProp = RouteProp<RootStackParamList, "OccasionInfo">;
export type OccasionInfoNavigateProps = StackNavigationProp<RootStackParamList, "OccasionInfo">;