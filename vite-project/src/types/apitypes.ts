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
    };
}

export interface AuthErrorResponse {
    message: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export type Subject = {
    _id: string;
    name: string;
    neptunId: string;
    type: string;
    teachers: string[];
    majors: string[];

}

export interface Attendance {
    _id: string;
    subjectId: string;
    subjectName: string;
    students: string[]; // List of student IDs
    teacherId: string;
    startDate: string;  // ISO date string
    endDate?: string | null;  // Optional ISO date string
    majors: string[];  // List of major IDs
}