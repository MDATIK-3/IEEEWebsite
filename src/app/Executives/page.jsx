"use client";
import { useEffect, useState, useMemo } from "react";
import Background from "./components/Background";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Stats from "./components/Stats";
import MemberList from "./components/MemberList";
import MobileFilters from "./components/MobileFilters";
import MemberDetailModal from "./components/MemberDetailModal";

const ExecutivePage = () => {
    const [executiveData, setExecutiveData] = useState({});
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("SB");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filterRole, setFilterRole] = useState("all");

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/executiveData.json');
                if (!res.ok) {
                    throw new Error(`Failed to fetch data (status: ${res.status})`);
                }
                const data = await res.json();
                setExecutiveData(data);
                const sortedYears = Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));
                setYears(sortedYears);
                if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0]);
                }
                setError(null);
            } catch (error) {
                console.error("Failed to load executive data:", error);
                setError("Could not load executive data. Please check the data source and your network connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { faculty, students, filteredAndSortedMembers } = useMemo(() => {
        if (loading || error || !selectedYear || !executiveData[selectedYear]) {
             return { faculty: [], students: [], filteredAndSortedMembers: [] };
        }

        const groupData = executiveData[selectedYear]?.[selectedGroup];
        if (!groupData) {
            return { faculty: [], students: [], filteredAndSortedMembers: [] };
        }

        const currentFaculty = (groupData.faculty || []).map(m => ({...m, isFaculty: true }));
        const currentStudents = (groupData.students || []).map(m => ({...m, isFaculty: false }));
        const allMembers = [...currentFaculty, ...currentStudents];

        const filtered = allMembers.filter(member => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                member.name.toLowerCase().includes(searchLower) ||
                member.role.toLowerCase().includes(searchLower) ||
                (member.department && member.department.toLowerCase().includes(searchLower));

            const matchesRole =
                filterRole === "all" ||
                (filterRole === "faculty" && member.isFaculty) ||
                (filterRole === "student" && !member.isFaculty) ||
                (filterRole === "president" && member.role.toLowerCase().includes("president")) ||
                (filterRole === "officer" && !member.role.toLowerCase().includes("president") && !member.isFaculty);

            return matchesSearch && matchesRole;
        });

        return {
            faculty: currentFaculty,
            students: currentStudents,
            filteredAndSortedMembers: filtered
        };

    }, [selectedYear, selectedGroup, executiveData, searchTerm, filterRole, sortBy, loading, error]);

    if (loading) {
        return <div className="app-grid-background"><Background /><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="app-grid-background"><Background /><ErrorDisplay error={error} /></div>;
    }

    return (
        <div className="min-h-screen app-grid-background flex font-inter">
            <Background />

            <Sidebar
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                executiveData={executiveData}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
            />

            <main className="flex-1 mt-10 p-6 lg:p-10">
                <Header
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMobileFilterClick={() => setShowMobileFilters(true)}
                />

                <Stats
                    members={filteredAndSortedMembers}
                    facultyCount={faculty.length}
                    studentCount={students.length}
                    yearCount={years.length}
                />

                <MemberList members={filteredAndSortedMembers} onMemberClick={setSelectedMember} />
            </main>

            <MobileFilters
                show={showMobileFilters}
                onClose={() => setShowMobileFilters(false)}
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                executiveData={executiveData}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
            />

            <MemberDetailModal
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
};

export default ExecutivePage;
