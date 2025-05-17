
import { Occasion, Attendance } from "./apitypes";

export interface TimelineOccasionCardProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}

export interface SoonOccasionContainerProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}

export interface NextOccasionProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
    onRefresh: () => void;
}

export interface ActiveAttendanceCardProps {
    attendance: Attendance;
    occasion?: Occasion;
    onRefresh: () => void;
}

export interface AndroidNfcReaderModalProps {
    visible: boolean;
    onClose: () => void;
    attendanceId: string;
    onRefresh: () => void;
}



export interface HistoryTableBodyProps {
    participants: Map<string, string[]>;
    sessionsLength: number;
    handleBodyScroll: (event: any) => void;
}

export interface UserProfileCardProps {
    userId: string;
    name: string;
    type: string;
    neptunCode?: string;
    majors?: string[];
    imageUri?: string;
}

export interface TimeDisplayProps {
    title: string;
    targetTime: string;
    isElapsed?: boolean;
    showDays?: boolean;
}

export interface SmallDataCardProps {
    leading?: string | { iconName: string };
    label?: string;
    data: {
        topLabel?: string;
        value: string;
        bottomLabel?: string;
        abbsenceLabel?: string;
        onPressFunction?: () => void;
        present?: boolean;

    }[];

    showWarning?: boolean;
    warningMessage?: string;
    warningFunction?: () => void;
    showAbsence?: boolean;

}

export interface ActivityItem {
    id: string;
    title: string;
    value: string;
    height: number;
}

export interface ProfileCardProps {
    occasions: Occasion[];
    attendances: Attendance[];
}