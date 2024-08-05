// services/apiTypes.ts

export interface University {
    _id: string;
    name: string;
    neptunUrl: string;
}

export interface Group {
    _id: string;
    name: string;
    universityId: string; // Reference to the university this group belongs to
}

export interface Major {
    _id: string;
    name: string;
    universityId: string; // Reference to the university this major belongs to
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
