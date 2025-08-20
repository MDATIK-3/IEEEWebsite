'use client';
import { useState, useEffect } from 'react';
import executiveData from '@/data/executiveData.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import MemberList from './components/MemberList';
import MobileFilters from './components/MobileFilters';
import MemberDetailModal from './components/MemberDetailModal';
import LoadingState from '@/app/components/LoadingSpinner';
import useFilteredMembers from '@/app/hooks/useFilteredMembers';

const ExecutivePage = () => {
  const years = Object.keys(executiveData).sort((a, b) => parseInt(b) - parseInt(a));
  const defaultYear = years[0] || '';
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedGroup, setSelectedGroup] = useState('SB');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const { faculty, students, filteredMembers } = useFilteredMembers({
    executiveData,
    searchTerm,
    selectedYear,
    selectedGroup,
  });

  useEffect(() => {
    setLoading(false)
  }, []);

  if (loading) {
    return <LoadingState />;
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
      />

      <main className="flex-1 mt-18 px-4 sm:px-6 lg:px-10 pb-10">
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