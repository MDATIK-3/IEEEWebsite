'use client';

import Link from 'next/link';
import membership from '@/data/membership.json';

const JoinPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-4">Join IEEE GUB</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join the IEEE Student Branch at Green University of Bangladesh and grow with a global network.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={membership.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Join IEEE (Global)
            </a>
            {membership.localContactLink && (
              <Link
                href={membership.localContactLink}
                className="inline-flex items-center rounded-full border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
              >
                Notify IEEE GUB
              </Link>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-emerald-800">
            <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4">Member Benefits</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {membership.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-emerald-800">
            <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4">How to Join</h2>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {membership.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm mb-12 dark:bg-slate-800 dark:border-emerald-800">
          <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-6">Membership Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {membership.fees.map((fee, index) => (
              <div key={index} className="rounded-xl border border-emerald-100 p-4 dark:border-emerald-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fee.label}</p>
                <p className="text-lg font-bold text-emerald-700">{fee.value}</p>
              </div>
            ))}
          </div>
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
      </div>
    </div>
  );
};

export default JoinPage;
