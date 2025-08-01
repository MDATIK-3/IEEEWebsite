"use client";
import { useState } from "react";
import executiveData from "@/data/executiveData.json";
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

  let faculty = [];
  let students = [];
  let filteredAndSortedMembers = [];

  if (selectedYear && executiveData[selectedYear]) {
    const groupData = executiveData[selectedYear]?.[selectedGroup];
    if (groupData) {
      faculty = (groupData.faculty || []).map(m => ({ ...m, isFaculty: true }));
      students = (groupData.students || []).map(m => ({ ...m, isFaculty: false }));
      const allMembers = [...faculty, ...students];

      filteredAndSortedMembers = allMembers.filter(member => {
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
    }
  }

  if (!defaultYear) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-100 to-red-50 dark:from-gray-900 dark:to-black text-red-600 text-xl font-semibold">
        No executive data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-inter bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
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

      <main className="flex-1 mt-18 px-4 sm:px-6 lg:px-10 pb-10">
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
