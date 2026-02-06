'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, FlaskConical, Layers, Users } from 'lucide-react';
import projects from '@/data/projects.json';

const ProjectsPage = () => {
  const [activeTag, setActiveTag] = useState('All');

  const tagOptions = useMemo(() => {
    const tags = new Set();
    projects.forEach((project) => project.tags?.forEach((tag) => tags.add(tag)));
    return ['All', ...Array.from(tags)];
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeTag === 'All') return true;
    return project.tags?.includes(activeTag);
  });
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((project) => project.status?.toLowerCase() === 'active').length;
    const completed = projects.filter((project) => project.status?.toLowerCase() === 'completed').length;
    return { total, active, completed };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 shadow-2xl px-6 py-10 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <FlaskConical className="h-4 w-4" />
                IEEE GUB Project Lab
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                Build, ship, and showcase real impact
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Work with IEEE GUB teams on research, products, and community projects. Find a track that matches your skills.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact/GeneralContact"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Join a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/Opportunities"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
                >
                  Explore Opportunities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <Users className="h-3 w-3 text-emerald-600" />
                  Multidisciplinary teams
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1">
                  <BadgeCheck className="h-3 w-3 text-emerald-600" />
                  Certificates & recognition
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-slate-800 dark:border-emerald-800 p-5 shadow-md">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                  <Layers className="h-4 w-4" />
                  Active Portfolio
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.active}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-3">
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{stats.completed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-600 text-white p-5 shadow-md">
                <p className="text-sm font-semibold">Need a team?</p>
                <p className="text-xs text-emerald-50 mt-2">
                  Share your idea and IEEE GUB will connect you with mentors and members.
                </p>
                <Link
                  href="/contact/GeneralContact"
                  className="inline-flex items-center gap-2 text-xs font-semibold mt-4"
                >
                  Submit a project idea
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">Browse projects</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Filter by track or interest.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    activeTag === tag
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 dark:bg-slate-800 dark:border-emerald-700 dark:text-emerald-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">No projects match the selected filter.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-emerald-800"
              >
                <div className="relative h-48">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 font-semibold dark:bg-emerald-900/30 dark:text-emerald-200">
                      {project.status}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{project.year}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{project.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-700 dark:text-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Team: {project.team?.join(', ')}
                  </div>
                  {project.links?.length ? (
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
