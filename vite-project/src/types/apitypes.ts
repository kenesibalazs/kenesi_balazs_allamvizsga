import { ObjectId } from 'mongoose'; // If using Mongoose types


export interface University {
    _id: string;
    name: string;
    neptunUrl: string;
}

export interface Group {
    _id: string;
    name: string;
    universityId: string;
}

export interface Major {
    _id: string;
    name: string;
    universityId: string;
}

export interface User {
    _id: string;
    name: string;
    neptunCode: string;
    type: string;
    universityId: string | University;
    majors: string[] | Major[];
    groups: string[] | Group[];
    occasionIds: string[];
    publicKey: string;
    profileImage?: string;
}

// Sign Up 
export interface UserSignup {
    name: string;
    neptunCode: string;
    password: string;
    passwordConfirm: string;
    universityId: string;
    type: string;
    majors?: string[];
    groups?: string[];
}

export interface AuthSuccessResponse {
    token: string;
    user: {
        id: string;
        name: string;
        neptunCode: string;
        type: string;
        universityId: string;
        majors: string[];
        groups: string[];
    };
}

export interface AuthErrorResponse {
    message: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export type Subject = {
    _id: string;
    name: string;
    timetableId: string;
}

export interface Attendance {
    _id: string;
    occasionId: string;
    startTime: Date;
    endTime: Date | null;
    sessionNumber: number;
    subjectId: string | Subject;
    participants: { userId: string | User; status: string }[];
    nfcCode?: string;
    nfcReaderId: string;
    isActive: boolean;
    teacherId: string;
}



export interface Comment {
    _id: string;
    creatorId: string | User;
    occasionId: Occasion ;
    createdAt: string;
    comment: string;
    timeId: string;
    activationDate: string;
    type: 'COMMENT' | 'TEST' | 'CANCELED';
    reactions?: {
        votes: {
            userId: string;
            type: 'upvote' | 'downvote';
        }[];
    };
    replies?: (string | Comment)[];
}

export interface Occasion {
    occasion: any;
    _id: string;
    id: string;
    dayId: string;
    subjectId: string | Subject;
    classroomId: string | Classroom;
    teacherId: string | User;
    groupIds: string[] | Group[];
    comments: string;
    startTime: string;
    endTime: string;
    validFrom: string;
    validUntil: string;
    repetition?: {
        interval: "weekly" | "bi-weekly";
        startingWeek?: number;
    };

    attendances: string[];


}



export interface Period {
    _id: string;
    id: string;
    starttime: string;
}

export interface Classroom {
    _id: string;
    id: string;
    name: string;
}