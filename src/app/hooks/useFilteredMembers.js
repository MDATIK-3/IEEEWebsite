"use client";
import { useMemo } from "react";
import Fuse from "fuse.js";

export default function useFilteredMembers({
    executiveData,
    searchTerm,
    selectedYear,
    selectedGroup,
}) {
    const allMembers = useMemo(() => {
        const members = [];
        Object.keys(executiveData).forEach(year => {
            Object.keys(executiveData[year]).forEach(group => {
                const groupData = executiveData[year][group];
                if (groupData) {
                    const faculty = (groupData.faculty || []).map(m => ({
                        ...m,
                        isFaculty: true,
                        year,
                        group,
                    }));
                    const students = (groupData.students || []).map(m => ({
                        ...m,
                        isFaculty: false,
                        year,
                        group,
                    }));
                    members.push(...faculty, ...students);
                }
            });
        });
        return members;
    }, [executiveData]);

    const fuse = useMemo(
        () =>
            new Fuse(allMembers, {
                keys: [
                    { name: "name", weight: 0.6 },
                    { name: "role", weight: 0.2 },
                    { name: "department", weight: 0.15 },
                    { name: "year", weight: 0.025 },
                    { name: "group", weight: 0.025 },
                ],
                threshold: 0.3,
                includeScore: true,
                minMatchCharLength: 1,
                shouldSort: true,
                ignoreLocation: true,
            }),
        [allMembers]
    );

    const { faculty, students, filteredMembers } = useMemo(() => {
        let faculty = [];
        let students = [];
        let filtered = [];

        if (searchTerm) {
            filtered = fuse
                .search(searchTerm)
                .map(result => ({ ...result.item, searchScore: result.score }))
                .sort((a, b) => a.searchScore - b.searchScore);
        } else if (selectedYear && executiveData[selectedYear]?.[selectedGroup]) {
            const groupData = executiveData[selectedYear][selectedGroup];
            faculty = (groupData.faculty || []).map(m => ({ ...m, isFaculty: true }));
            students = (groupData.students || []).map(m => ({ ...m, isFaculty: false }));
            filtered = [...faculty, ...students];
        }

        faculty = filtered.filter(m => m.isFaculty);
        students = filtered.filter(m => !m.isFaculty);

        return { faculty, students, filteredMembers: filtered };
    }, [searchTerm, selectedYear, selectedGroup, fuse, executiveData]);

    return { allMembers, faculty, students, filteredMembers };
}
