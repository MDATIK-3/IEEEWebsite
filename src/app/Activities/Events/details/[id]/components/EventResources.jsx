'use client';

import { FileText, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';

const iconMap = {
  slides: FileText,
  video: Video,
  gallery: ImageIcon,
  link: ExternalLink,
};

const EventResources = ({ resources = [] }) => {
  if (!resources.length) return null;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white/90 dark:bg-slate-800/90 dark:border-emerald-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">Event Resources</h3>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-200 px-3 py-1 rounded-full">
          {resources.length} items
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => {
          const Icon = iconMap[resource.type] || FileText;
          return (
            <div
              key={`${resource.label}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-emerald-800"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{resource.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{resource.type || 'resource'}</p>
                </div>
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
              >
                Open
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventResources;
