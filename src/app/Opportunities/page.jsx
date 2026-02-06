'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Briefcase, CalendarCheck, Users } from 'lucide-react';
import opportunities from '@/data/opportunities.json';

const OpportunitiesPage = () => {
  const [committeeFilter, setCommitteeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const committeeOptions = useMemo(() => {
    const committees = new Set(opportunities.map((o) => o.committee).filter(Boolean));
    return ['All', ...Array.from(committees)];
  }, []);

  const statusOptions = ['All', 'Open', 'Closed'];

  const filtered = opportunities.filter((opportunity) => {
    const matchesCommittee =
      committeeFilter === 'All' || opportunity.committee === committeeFilter;
    const matchesStatus =
      statusFilter === 'All' || opportunity.status === statusFilter;
    return matchesCommittee && matchesStatus;
  });
  const stats = useMemo(() => {
    const total = opportunities.length;
    const open = opportunities.filter((opportunity) => opportunity.status === 'Open').length;
    const closed = opportunities.filter((opportunity) => opportunity.status === 'Closed').length;
    return { total, open, closed };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 shadow-2xl px-6 py-10 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <Briefcase className="h-4 w-4" />
                IEEE GUB Volunteer Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                Lead, volunteer, and grow with IEEE GUB
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Join committees, support events, and build a leadership portfolio while serving the IEEE GUB community.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact/GeneralContact"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Apply to Volunteer
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/Projects"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
                >
                  See Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <Users className="h-3 w-3 text-emerald-600" />
                  Leadership roles
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <BadgeCheck className="h-3 w-3 text-emerald-600" />
                  Verified certificates
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-slate-800 dark:border-emerald-800 p-5 shadow-md">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                  <CalendarCheck className="h-4 w-4" />
                  Opportunities snapshot
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.open}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Open</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.closed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Closed</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-600 text-white p-5 shadow-md">
                <p className="text-sm font-semibold">Need help choosing?</p>
                <p className="text-xs text-emerald-50 mt-2">
                  Tell us your interests and we'll recommend the right committee.
                </p>
                <Link
                  href="/contact/GeneralContact"
                  className="inline-flex items-center gap-2 text-xs font-semibold mt-4"
                >
                  Get guidance
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">Find your role</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Filter by committee and availability.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={committeeFilter}
                onChange={(e) => setCommitteeFilter(e.target.value)}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200"
              >
                {committeeOptions.map((committee) => (
                  <option key={committee} value={committee}>
                    {committee === 'All' ? 'All Committees' : committee}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">No opportunities match the selected filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-emerald-800"
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 font-semibold dark:bg-emerald-900/30 dark:text-emerald-200">
                    {opportunity.committee}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-semibold ${
                      opportunity.status === 'Open'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {opportunity.status}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{opportunity.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{opportunity.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Time Commitment: {opportunity.timeCommitment}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">Deadline: {opportunity.deadline}</div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {opportunity.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-700 dark:text-emerald-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {opportunity.status === 'Open' ? (
                  <a
                    href={opportunity.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Apply Now
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-600">
                    Applications Closed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
