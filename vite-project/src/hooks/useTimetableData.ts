// hooks/useTimetableData.ts
import { useEffect, useCallback, useState } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod';
import useGroups from './useGroups';
import useAttendance from './useAttendance';
import { useAuth } from '../context/AuthContext';

const useTimetableData = () => {
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { userAttendances, fetchStudetsAttendances , fetchTeachersAttendances} = useAttendance();
    const { userActiveAttendances, fetchStudentActiveAttendances , fetchTeachersActiveAttendance} = useAttendance();
    const { groups, fetchAllGroupsData } = useGroups();
    const { periods, fetchPeriods } = usePeriod();
    const { userData, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userData) return;

        try {
            setIsLoading(true);
            
            const occasionIds = (userData.occasionIds || []).map((id) => id.toString());

            const promises = [
                fetchAllSubjectsData(),
                fetchAllGroupsData(),
                fetchPeriods(),
                fetchOccasionsByIds(occasionIds),

            ]
            
            if (userData.type === "STUDENT") {
                promises.push(fetchStudetsAttendances(userData._id));
                promises.push(fetchStudentActiveAttendances(userData._id))
            }else if (userData.type == "TEACHER"){
                promises.push(fetchTeachersAttendances(userData._id));
                promises.push(fetchTeachersActiveAttendance(userData._id))
            }

            await Promise.all(promises);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch timetable data.");
        } finally {
            setIsLoading(false);
        }
    }, [userData, fetchAllSubjectsData, fetchAllGroupsData, fetchPeriods, fetchOccasionsByIds, fetchStudetsAttendances, fetchTeachersAttendances,fetchStudentActiveAttendances,fetchTeachersActiveAttendance ]);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
        fetchData();
    }, [fetchData, logout, userData]);


   

    if (!userData) {
        return {
            occasions: [],
            subjects: [],
            periods: [],
            groups: [],
            userAttendances: [], 
            userActiveAttendances: [],
            classrooms: [],
            addCommentToOccasion: () => { },
            isLoading,
            error,
            fetchData,
        };
    }

    return { occasions, subjects, periods, groups, userAttendances, userActiveAttendances, isLoading, error,  fetchData, };
};

export default useTimetableData;