"use client";
import { Sparkles, BadgeCheck, GraduationCap, History } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-center">
        <div className="flex items-center gap-4">
            {/* Icon without background */}
            <Icon className={`h-7 w-7 text-${color}-600`} />
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </div>
    </div>
);

const Stats = ({ members, facultyCount, studentCount, yearCount }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Sparkles} value={members.length} label="Filtered Members" color="emerald" />
        <StatCard icon={BadgeCheck} value={facultyCount} label="Total Faculty" color="lime" />
        <StatCard icon={GraduationCap} value={studentCount} label="Total Students" color="green" />
        <StatCard icon={History} value={yearCount} label="Years Available" color="gray" />
    </div>
);

export default Stats;
