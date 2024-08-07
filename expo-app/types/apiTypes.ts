// services/apiTypes.ts

export interface User {
    id: string;
    name: string;
    neptunCode: string;
    type: string;
    universityId: string;
    majors: string[];
    groups: string[];
}


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

export interface AuthResponse {
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
