'use client';
import { useState } from 'react';
import executiveData from '@/data/executiveData.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import MemberList from './components/MemberList';
import MobileFilters from './components/MobileFilters';
import MemberDetailModal from './components/MemberDetailModal';
import useFilteredMembers from '@/app/hooks/useFilteredMembers';

const ExecutivePage = () => {
  const years = Object.keys(executiveData).sort((a, b) => parseInt(b) - parseInt(a));
  const defaultYear = years[0] || '';
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedGroup, setSelectedGroup] = useState('SB');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const { faculty, students, filteredMembers } = useFilteredMembers({
    executiveData,
    searchTerm,
    selectedYear,
    selectedGroup,
  });

  if (!defaultYear) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-100 to-red-50 dark:from-gray-900 dark:to-black text-red-600 text-xl font-semibold">
        No executive data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="flex gap-6">
        <Sidebar
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          executiveData={executiveData}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onMobileFilterClick={() => setShowMobileFilters(true)}
          />

          <Stats
            members={filteredMembers}
            facultyCount={faculty.length}
            studentCount={students.length}
            yearCount={years.length}
          />

          <MemberList members={filteredMembers} onMemberClick={setSelectedMember} />
        </main>
      </div>

      <MobileFilters
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        executiveData={executiveData}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
};

export default ExecutivePage;
