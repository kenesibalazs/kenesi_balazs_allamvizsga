import { useState, useCallback } from "react";
import {
    fetchUniversitiesForRegister,
    fetchMajorsForRegister,
    fetchGroupsForRegister
} from "../services/api";

import { University, Major, Group } from "../types/apitypes";


const useRegister = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUnivesitiesDataForRegister = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUniversitiesForRegister();
            setUniversities(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch all universities.');
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchMajorsByUniversityIdDataForRegister = useCallback(async (universityId: string) => {
        setLoading(true);
        try {
            const data = await fetchMajorsForRegister(universityId);
            setMajors(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch majors by university ID.');
        } finally {
            setLoading(false);
        }


    }, []);


    const fetchGroupsByMajorIdDataForRegister = useCallback(async (majorIds: string[]) => {
        setLoading(true);
        try {
            const data = await Promise.all(majorIds.map(fetchGroupsForRegister));
            setGroups(data.flat());
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch groups by major ID.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        universities,
        majors,
        groups,
        error,
        loading,
        fetchUnivesitiesDataForRegister,
        fetchMajorsByUniversityIdDataForRegister,
        fetchGroupsByMajorIdDataForRegister
    };
};

export default useRegister;