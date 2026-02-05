'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import events from '@/data/eventData.json';

const iconMap = {
  slides: FileText,
  video: Video,
  gallery: ImageIcon,
  link: ExternalLink,
};

const ResourcesPage = () => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  const resources = useMemo(() => {
    return events.flatMap((event) =>
      (event.resources || []).map((resource) => ({
        ...resource,
        eventId: event.id,
        eventName: event.eventName,
        eventType: event.eventType,
        date: event.date,
        year: event.date ? new Date(event.date).getFullYear() : null,
      }))
    );
  }, []);

  const typeOptions = useMemo(() => {
    const types = new Set(resources.map((r) => r.eventType).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [resources]);

  const yearOptions = useMemo(() => {
    const years = new Set(resources.map((r) => r.year).filter(Boolean));
    return ['All', ...Array.from(years).sort((a, b) => b - a)];
  }, [resources]);

  const filteredResources = resources.filter((resource) => {
    const matchesType = typeFilter === 'All' || resource.eventType === typeFilter;
    const matchesYear = yearFilter === 'All' || resource.year === Number(yearFilter);
    return matchesType && matchesYear;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-3">Event Resources</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Slides, recordings, and highlights from IEEE GUB events.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Event Types' : type}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year === 'All' ? 'All Years' : year}
              </option>
            ))}
          </select>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">No resources found for the selected filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const Icon = iconMap[resource.type] || FileText;
              return (
                <div
                  key={`${resource.label}-${index}`}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-emerald-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{resource.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{resource.eventName}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{resource.eventType}</span>
                    <span>{resource.date}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/Activities/Events/details/${resource.eventId}`}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                    >
                      View Event
                    </Link>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                    >
                      Open Resource
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
