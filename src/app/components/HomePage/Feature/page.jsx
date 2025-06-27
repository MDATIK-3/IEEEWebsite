'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import ColabCard from "./ColabCard";

const Feature = () => {
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/Colab.json')
      .then(response => response.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.id - b.id);
        setEvents(sorted);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching collaborations:', error);
        setLoading(false);
      });
  }, []);

  const displayedEvents = showAll ? events : events.slice(0, 4);

  if (loading) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
            IEEE Collaborations
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Empowering innovation through strategic partnerships with leading technology organizations,
            fostering research excellence and driving industry advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayedEvents.map((event, index) => (
            <div
              key={event.id}
              className="transform transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.9s ease-out forwards'
              }}
            >
              <ColabCard event={event} />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!showAll && events.length > 4 && (
            <Link href="/colab">
              <button className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  View All Collaborations
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          )}

          <button className="group px-8 py-4 font-semibold text-emerald-700 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1">
            <span className="flex items-center">
              Partner With Us
              <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Feature;
