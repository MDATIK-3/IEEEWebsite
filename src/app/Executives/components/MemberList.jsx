"use client";
import MemberCard from './MemberCard';
import { Search, BadgeCheck, GraduationCap } from 'lucide-react';

const MemberList = ({ members, onMemberClick }) => {
    if (members.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No members found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
        );
    }

    const faculty = members.filter(m => m.isFaculty);
    const students = members.filter(m => !m.isFaculty);

    return (
        <>
            {faculty.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 rounded-lg shadow-sm">
                            <BadgeCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Faculty Advisors</h2>
                        <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-lg font-medium shadow-sm">
                            {faculty.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {faculty.map((member, index) => (
                            <MemberCard
                                key={`${member.name}-${index}`}
                                member={member}
                                isFaculty={true}
                                onClick={() => onMemberClick(member)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {students.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-50 rounded-lg shadow-sm">
                            <GraduationCap className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Student Executive Board</h2>
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-lg font-medium shadow-sm">
                            {students.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {students.map((member, index) => (
                            <MemberCard
                                key={`${member.name}-${index}`}
                                member={member}
                                isFaculty={false}
                                onClick={() => onMemberClick(member)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MemberList;
