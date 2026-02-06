"use client";
import { Sparkles, BadgeCheck, GraduationCap, History } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, iconClass, iconBg }) => (
    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between dark:bg-slate-800 dark:border-emerald-800">
        <div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">{value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
    </div>
);

const Stats = ({ members, facultyCount, studentCount, yearCount }) => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
            icon={Sparkles}
            value={members.length}
            label="Filtered Members"
            iconClass="text-emerald-700"
            iconBg="bg-emerald-50 dark:bg-emerald-900/30"
        />
        <StatCard
            icon={BadgeCheck}
            value={facultyCount}
            label="Total Faculty"
            iconClass="text-lime-700"
            iconBg="bg-lime-50 dark:bg-lime-900/30"
        />
        <StatCard
            icon={GraduationCap}
            value={studentCount}
            label="Total Students"
            iconClass="text-teal-700"
            iconBg="bg-teal-50 dark:bg-teal-900/30"
        />
        <StatCard
            icon={History}
            value={yearCount}
            label="Years Available"
            iconClass="text-slate-700 dark:text-slate-200"
            iconBg="bg-slate-100 dark:bg-slate-700/60"
        />
    </div>
);

export default Stats;
