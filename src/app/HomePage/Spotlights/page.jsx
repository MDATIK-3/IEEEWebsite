'use client';

import Image from 'next/image';
import { Facebook, Github, Linkedin } from 'lucide-react';
import spotlights from '@/data/spotlights.json';

const socialIcons = {
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
};

const Spotlights = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-6">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 right-0 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-4">
            Member Spotlights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stories from the community shaping innovation at IEEE GUB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlights.map((member) => (
            <article
              key={member.id}
              className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg dark:bg-slate-800/90 dark:border-emerald-800"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border border-emerald-200">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                  <p className="text-sm text-emerald-600">{member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{member.quote}"</p>
              <div className="flex items-center gap-3 mt-4">
                {member.socials &&
                  Object.entries(member.socials).map(([key, url]) => {
                    const Icon = socialIcons[key];
                    if (!Icon) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700"
                        aria-label={key}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Spotlights;
