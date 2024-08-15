// import axios from 'axios';
// import {
//     University, Major, Group, AuthResponse, UserSignup, Attendance, Subject, User, AuthSuccessResponse
// } from '../types/apitypes';

// // Base URL for API requests
// const API_URL = 'http://192.168.0.104:3000/api';

// // Create an Axios instance
// const apiClient = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });



// // Fetch data for the register page

// export const fetchUniversitiesForRegister = async (): Promise<University[]> => {
//     try {
//         const response = await apiClient.get('/register/universities');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching universities:', error);
//         return [];
//     }
// };

// export const fetchMajorsForRegister = async (universityId: string): Promise<Major[]> => {
//     try {
//         const response = await apiClient.get(`/register/universities/${universityId}/majors`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching majors:', error);
//         return [];
//     }
// };


// export const fetchGroupsForRegister = async (majorId: string): Promise<Group[]> => {
//     try {
//         const response = await apiClient.get(`/register/majors/${majorId}/groups`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching groups:', error);
//         return [];
//     }
// };


// // Helper function to get token
// const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         throw new Error('No authentication token found');
//     }
//     return { Authorization: `Bearer ${token}` };
// };

// // Login user

// export const loginUser = async (values: any): Promise<AuthResponse> => {
//     try {
//         const response = await apiClient.post('/login', values);

//         if ('token' in response.data) {
//             const { token } = response.data as AuthSuccessResponse;
//             localStorage.setItem('token', token); // Store token in localStorage
//             console.log('Login successful with token:', token);
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Login error:', error);
//         return { message: 'Login failed' };
//     }
// };

// // Signup user
// export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
//     try {
//         const response = await apiClient.post('/signup', values);
//         return response.data;
//     } catch (error) {
//         console.error('Signup error:', error);
//         return { message: 'Registration failed' };
//     }
// };


// // Fetch universities
// export const fetchUniversities = async (): Promise<University[]> => {
//     try {
//         const response = await apiClient.get('/universities', {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch universities error:', error);
//         throw new Error('Failed to fetch universities');
//     }
// };


// // MAJORS API
// // Fetch majors
// export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
//     try {
//         const response = await apiClient.get('/majors', {
//             headers: getAuthHeaders(),
//             params: universityId ? { universityId } : {},
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch majors error:', error);
//         throw new Error('Failed to fetch majors');
//     }
// };
// // Fetch majors by university ID
// export const fetchMajorsByUniversityId = async (universityId: string): Promise<Major[]> => {
//     try {
//         const response = await apiClient.get(`/majors/university/${universityId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch majors by university ID error:', error);
//         throw new Error('Failed to fetch majors');
//     }
// };
// // Fetch a major by ID
// export const fetchMajorById = async (id: string): Promise<Major> => {
//     try {
//         const response = await apiClient.get(`/majors/${id}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch major by ID error:', error);
//         throw new Error('Failed to fetch major');
//     }
// };


// // Fetch all groups
// export const fetchAllGroups = async (): Promise<Group[]> => {
//     try {
//         const response = await apiClient.get('/groups', {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch all groups error:', error);
//         throw new Error('Failed to fetch groups');
//     }
// };

// // Fetch groups by major ID
// export const fetchGroupsByMajorId = async (majorId: string): Promise<Group[]> => {
//     try {
//         const response = await apiClient.get(`/groups/majors/${majorId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch groups by major ID error:', error);
//         throw new Error('Failed to fetch groups');
//     }
// };

// // Fetch a group by ID
// export const fetchGroupById = async (id: string): Promise<Group> => {
//     try {
//         const response = await apiClient.get(`/groups/${id}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch group by ID error:', error);
//         throw new Error('Failed to fetch group');
//     }
// };

// // Attendance API
// // Create attendance
// export const createAttendance = async (data: Omit<Attendance, '_id'>): Promise<Attendance> => {
//     try {
//         const response = await apiClient.post('/attendances', data, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Create attendance error:', error);
//         throw new Error('Failed to create attendance');
//     }
// };

// // Fetch attendances by teacher ID
// export const fetchAttendancesByTeacherId = async (teacherId: string): Promise<Attendance[]> => {
//     try {
//         const response = await apiClient.get(`/attendances/teacher/${teacherId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch attendances by teacher ID error:', error);
//         throw new Error('Failed to fetch attendances');
//     }
// };

// // Fetch attendances by group ID
// export const fetchAttendancesByGroupId = async (groupId: string): Promise<Attendance[]> => {
//     try {
//         const response = await apiClient.get(`/attendances/group/${groupId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch attendances by group ID error:', error);
//         throw new Error('Failed to fetch attendances');
//     }
// }

// // Update attendance by ID
// export const updateAttendanceById = async (id: string, data: Partial<Omit<Attendance, '_id'>>): Promise<Attendance | null> => {
//     try {
//         const response = await apiClient.put(`/attendances/${id}`, data, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Update attendance by ID error:', error);
//         throw new Error('Failed to update attendance');
//     }
// }


// export const addStudentToAttendance = async (attendanceId: string, studentId: string): Promise<Attendance> => {
//     try {
//         const response = await apiClient.patch(`/attendance/${attendanceId}/student/${studentId}`, {}, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Add student to attendance error:', error);
//         throw new Error('Failed to add student to attendance');
//     }
// };

// //app.get('/attendances/subject/:subjectId/teacher/:teacherId', attendanceController.getAttendancesBySubjectIdAndTeacherId.bind(attendanceController));

// export const fetchAttendancesBySubjectIdAndTeacherId = async (subjectId: string, teacherId: string): Promise<Attendance[]> => {
//     try {
//         const response = await apiClient.get(`/attendances/subject/${subjectId}/teacher/${teacherId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch attendances by subject ID and teacher ID error:', error);
//         throw new Error('Failed to fetch attendances');
//     }
// };

// export const endAttendance = async (attendanceId: string): Promise<Attendance | null> => {
//     try {
//         const response = await apiClient.patch(`/attendance/${attendanceId}/end`, {}, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('End attendance error:', error);
//         throw new Error('Failed to end attendance');
//     }   

// }

// // Fetch all subjects
// export const fetchAllSubjects = async (): Promise<Subject[]> => {
//     try {
//         const response = await apiClient.get('/subjects', {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch all subjects error:', error);
//         throw new Error('Failed to fetch subjects');
//     }
// };

// // Fetch user by ID
// export const fetchUserById = async (id: string): Promise<User> => {
//     try {
//         const response = await apiClient.get(`/user/${id}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch user by ID error:', error);
//         throw new Error('Failed to fetch user');
//     }
// };


