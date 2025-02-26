// services/apiTypes.ts

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
    id: string;
    name: string;
    neptunCode: string;
    type: string;
    universityId: string;
    majors: string[];
    groups: string[];
    occasionIds: string[];
    publickey: string;
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
    name: string;
    majorIds: string[];
    groupIds: string[];
    teacherId: string;
    subjectId: string;
    studentIds: string[];
    startDate: string;
    endDate: string | null;
}


export interface Comment {
    dayId: string;
    timeId: string;
    type: 'COMMENT' | 'TEST' | 'FREE';
    comment: string;
}

export interface Occasion {
    _id: string;
    id: string;
    dayId: string;
    subjectId: string;
    classroomId: string[];
    teacherId: string[];
    groupIds: string[];
    comments: [
        {
            type: 'COMMENT' | 'TEST' | 'CANCELED';
            creatorId: string;
            comment: string;
            activationDate: string;
        }
    ]

    startTime: string;
    endTime: string;
    validFrom: string;
    validUntil: string;
    repetition?: {
        interval: "weekly" | "bi-weekly";
        startingWeek?: number;
    };

    attendance: [
        {
            _id: string;
            startTime: string;
            endTime: string;
            sessionNumber: number;
            participants: [
                {
                    userId: string;
                    status: string;
                }
            ]

        }
    ]
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