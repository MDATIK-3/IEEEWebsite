import Link from "next/link";
import ColabCard from "./ColabCard";
import colabData from "@/data/collaboration.json";

const Feature = () => {
  const showAll = false;
  const sortedEvents = [...colabData].sort((a, b) => a.id - b.id);
  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 8);

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-br from-white via-emerald-50 to-teal-50
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
        transition-colors duration-300 py-24 px-6 sm:px-12
      "
    >
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-200 dark:bg-emerald-900/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 dark:bg-teal-900/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-1000" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14 px-6 sm:px-0">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-emerald-600 via-teal-500 to-teal-600 dark:from-emerald-400 dark:via-teal-300 dark:to-teal-400 bg-clip-text text-transparent mb-6">
            IEEE Collaborations
          </h2>
          <p className="text-lg max-w-4xl mx-auto leading-relaxed text-gray-700 dark:text-gray-300">
            Empowering innovation through strategic partnerships with leading technology organizations,
            fostering research excellence and driving industry advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 px-4 sm:px-0">
          {displayedEvents.map((event, index) => (
            <div
              key={event.id}
              className="transform transition-transform duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 120}ms`,
                animation: "fadeInUp 1s ease-out forwards",
              }}
            >
              <ColabCard event={event} />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-6 sm:px-0">
          {sortedEvents.length > 8 && (
            <Link
              href="/Collaboration"
              className="w-full sm:w-auto group relative px-10 py-4 font-semibold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-teal-700 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-400 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center">
                View All Collaborations
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-700 to-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            </Link>
          )}

          <Link
            href="/contact"
            className="w-full sm:w-auto group cursor-pointer px-10 py-4 font-semibold text-emerald-700 dark:text-white bg-white dark:bg-transparent border-2 border-emerald-300 dark:border-emerald-500 rounded-3xl shadow-md hover:shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-400 flex items-center justify-center"
          >
            <span className="flex items-center justify-center">
              Partner With Us
              <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Feature;
