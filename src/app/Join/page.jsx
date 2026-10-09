'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Globe,
  GraduationCap,
  Handshake,
  Mail,
  Sparkles,
  Users,
} from 'lucide-react';
import membership from '@/data/membership.json';

const JoinPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="rounded-3xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-900/50 shadow-2xl px-6 py-10 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <Sparkles className="h-4 w-4" />
                IEEE Student Branch - Green University of Bangladesh
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                Join IEEE GUB and lead your tech journey
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Become part of a global IEEE network while growing locally through IEEE GUB events, mentorship,
                and leadership opportunities.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  IEEE SB
                </span>
                <span className="rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  IEEE CS
                </span>
                <span className="rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  IEEE PES
                </span>
                <span className="rounded-full border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  Workshops & Competitions
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={membership.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Join IEEE (Global)
                  <ArrowRight className="h-4 w-4" />
                </a>
                {membership.localContactLink && (
                  <Link
                    href={membership.localContactLink}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
                  >
                    Notify IEEE GUB
                    <Mail className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-slate-800 dark:border-emerald-800 p-6 shadow-lg space-y-5">
              <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                Membership at a glance
              </h2>
              <div className="space-y-3">
                {membership.fees.map((fee, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-4 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fee.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Annual</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-200">
                      {fee.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                Fees are updated by IEEE GUB for the current membership cycle.
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-emerald-800 space-y-5">
            <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">Why IEEE GUB?</h2>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {membership.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <BadgeCheck className="h-3 w-3" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-4">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                  <Users className="h-4 w-4" /> Strong local community
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Meet peers, seniors, and alumni through IEEE GUB events.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 p-4">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                  <Globe className="h-4 w-4" /> Global IEEE access
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Connect to IEEE resources, publications, and worldwide events.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-emerald-800 space-y-5">
            <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">How to join</h2>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {membership.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="rounded-xl border border-emerald-100 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                <Handshake className="h-4 w-4" /> Local onboarding support
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                After joining IEEE, send your confirmation to IEEE GUB and we'll guide you into the right chapter,
                events, and volunteer tracks.
              </p>
              {membership.localContactLink && (
                <Link
                  href={membership.localContactLink}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200 hover:underline"
                >
                  Contact IEEE GUB for onboarding
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Events & Workshops',
              description: 'Join technical sessions, competitions, and flagship events.',
              icon: <CalendarCheck className="h-5 w-5" />,
              href: '/Activities/Events',
            },
            {
              title: 'Projects',
              description: 'Work on real projects with teams and mentors.',
              icon: <GraduationCap className="h-5 w-5" />,
              href: '/Projects',
            },
            {
              title: 'Opportunities',
              description: 'Volunteer, lead, and build your leadership portfolio.',
              icon: <Users className="h-5 w-5" />,
              href: '/Opportunities',
            },
            {
              title: 'Resources',
              description: 'Access slides, recordings, and highlights.',
              icon: <BadgeCheck className="h-5 w-5" />,
              href: '/Resources',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:bg-slate-800 dark:border-emerald-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                {item.icon}
                {item.title}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.description}</p>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-200 mt-3 inline-flex items-center gap-1">
                Explore
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-6">FAQs</h2>
          <div className="space-y-3">
            {membership.faqs.map((faq, index) => (
              <details key={index} className="group rounded-xl border border-emerald-100 p-4 dark:border-emerald-800">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-600 text-white p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Ready to join IEEE GUB?</h3>
            <p className="text-sm text-emerald-50">
              Take the first step today. We'll help you find the right chapter and opportunities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={membership.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700"
            >
              Join IEEE
              <ArrowRight className="h-4 w-4" />
            </a>
            {membership.localContactLink && (
              <Link
                href={membership.localContactLink}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contact IEEE GUB
                <Mail className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JoinPage;
