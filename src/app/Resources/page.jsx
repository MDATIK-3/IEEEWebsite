'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Layers,
  Library,
  Video,
} from 'lucide-react';
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

  const stats = useMemo(() => {
    const total = resources.length;
    const eventTypes = new Set(resources.map((r) => r.eventType).filter(Boolean)).size;
    const years = new Set(resources.map((r) => r.year).filter(Boolean)).size;
    return { total, eventTypes, years };
  }, [resources]);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 shadow-2xl px-6 py-10 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <Library className="h-4 w-4" />
                IEEE GUB Resource Library
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                Catch up on every IEEE GUB session
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Browse slides, recordings, and highlight links from recent IEEE GUB events, workshops, and talks.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/Activities/Events"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Browse Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/Join"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
                >
                  Join IEEE GUB
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <FileText className="h-3 w-3 text-emerald-600" />
                  Slides and decks
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <Video className="h-3 w-3 text-emerald-600" />
                  Recordings
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <ImageIcon className="h-3 w-3 text-emerald-600" />
                  Photo galleries
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-slate-800 dark:border-emerald-800 p-5 shadow-md">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                  <Layers className="h-4 w-4" />
                  Resource snapshot
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Resources</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.eventTypes}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Event types</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.years}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Years covered</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-600 text-white p-5 shadow-md">
                <p className="text-sm font-semibold">Missing a session?</p>
                <p className="text-xs text-emerald-50 mt-2">
                  Request the slides or recording and we will update the library.
                </p>
                <Link
                  href="/contact/GeneralContact"
                  className="inline-flex items-center gap-2 text-xs font-semibold mt-4"
                >
                  Request a resource
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">Filter resources</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Choose an event type and year.</p>
            </div>
            <div className="flex flex-wrap gap-4">
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
          </div>
        </section>

        {filteredResources.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No resources found for the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const Icon = iconMap[resource.type] || FileText;
              return (
                <article
                  key={`${resource.label}-${index}`}
                  className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-emerald-800 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{resource.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{resource.eventName}</p>
                      </div>
                    </div>
                    {resource.eventType && (
                      <span className="text-xs font-semibold rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 dark:border-emerald-700 dark:text-emerald-200">
                        {resource.eventType}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {resource.year && (
                      <span className="rounded-full border border-emerald-200 px-2.5 py-1 text-emerald-700 dark:border-emerald-700 dark:text-emerald-200">
                        {resource.year}
                      </span>
                    )}
                    {resource.date && <span>{resource.date}</span>}
                    {resource.type && (
                      <span className="uppercase tracking-wide text-emerald-600 dark:text-emerald-200">
                        {resource.type}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/Activities/Events/details/${resource.eventId}`}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                    >
                      View Event
                    </Link>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200 inline-flex items-center gap-1"
                      >
                        Open Resource
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
