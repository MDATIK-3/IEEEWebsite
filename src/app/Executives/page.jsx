"use client";
import { useState, useMemo } from "react";
import executiveData from "@/data/executiveData.json";

import Background from "./components/Background";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Stats from "./components/Stats";
import MemberList from "./components/MemberList";
import MobileFilters from "./components/MobileFilters";
import MemberDetailModal from "./components/MemberDetailModal";

const ExecutivePage = () => {
  const years = Object.keys(executiveData).sort((a, b) => parseInt(b) - parseInt(a));
  const defaultYear = years[0] || "";

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedGroup, setSelectedGroup] = useState("SB");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterRole, setFilterRole] = useState("all");

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const { faculty, students, filteredAndSortedMembers } = useMemo(() => {
    if (!selectedYear || !executiveData[selectedYear]) {
      return { faculty: [], students: [], filteredAndSortedMembers: [] };
    }

    const groupData = executiveData[selectedYear]?.[selectedGroup];
    if (!groupData) {
      return { faculty: [], students: [], filteredAndSortedMembers: [] };
    }

    const currentFaculty = (groupData.faculty || []).map(m => ({ ...m, isFaculty: true }));
    const currentStudents = (groupData.students || []).map(m => ({ ...m, isFaculty: false }));
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
  }, [selectedYear, selectedGroup, searchTerm, filterRole, sortBy]);

  if (!defaultYear) {
    return (
      <div className="app-grid-background flex justify-center items-center min-h-screen text-red-600 text-xl">
        No executive data available.
      </div>
    );
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

      <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
};

export default ExecutivePage;
