'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-3">Project Showcase</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore student-led initiatives and join a team that matches your interests.
          </p>
          <Link
            href="/contact/GeneralContact"
            className="inline-flex mt-6 items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Join a Project
          </Link>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
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
