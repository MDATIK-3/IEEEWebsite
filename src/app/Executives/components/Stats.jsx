"use client";
import { Sparkles, BadgeCheck, GraduationCap, History } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 text-${color}-600`} />
            <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
            </div>
        </div>
    </div>
);

const Stats = ({ members, facultyCount, studentCount, yearCount }) => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Sparkles} value={members.length} label="Filtered Members" color="emerald" />
        <StatCard icon={BadgeCheck} value={facultyCount} label="Total Faculty" color="lime" />
        <StatCard icon={GraduationCap} value={studentCount} label="Total Students" color="green" />
        <StatCard icon={History} value={yearCount} label="Years Available" color="gray" />
    </div>
);

export default Stats;
