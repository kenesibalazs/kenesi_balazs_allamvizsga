// services/apiTypes.ts

export interface University {
    _id: string;
    name: string;
    neptunUrl: string;
}

export interface Group {
    _id: string;
    name: string;
    oldId: string;
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
  }
  
// Sign Up 
export interface UserSignup {
    name: string;
    neptunCode: string;
    password: string;
    passwordConfirm: string;
    universityId: string;
    type: string;
    majors?: string[];  // Optional
    groups?: string[];  // Optional
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
        occasionIds: string[];
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

export  interface Student {
    key: string;
    name: string;
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
    timeId: string;
    subjectId: string;
    classroomId: string[];
    teacherId: string[];
    groupIds: string[];
    comments: [
        {
            dayId: string;
            timeId: string;
            type: 'COMMENT' | 'TEST' | 'FREE';
            comment: string;
            activationDate: string;
        }
    ]
}


export interface Period {
    _id: string;
    id: string;
    starttime: string;
}

export interface Classroom{
    _id: string;
    id: string;
    name: string;
}