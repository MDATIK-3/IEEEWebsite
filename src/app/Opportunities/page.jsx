'use client';

import { useMemo, useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-3">Volunteer Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Build leadership skills by supporting IEEE GUB teams and events.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
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
