'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

function Contributors() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('/api/contributors');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();

        if (Array.isArray(data)) {
          setTeamMembers(data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setTeamMembers([]);
        } else {
          console.error('Contributors data is not an array:', data);
          setError('Unexpected data format');
          setTeamMembers([]);
        }
      } catch (err) {
        console.error('Failed to fetch contributors:', err);
        setError('Failed to fetch contributors');
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="border-t border-gray-200 dark:border-slate-800 p-2 mt-6">
      <div className="text-center space-y-1 md:space-y-0">
        <div className="md:flex md:items-center md:justify-center md:gap-4 md:flex-wrap lg:flex-nowrap">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 md:whitespace-nowrap">
            © {currentYear} Green University IEEE Student Branch. All rights reserved.
          </p>

          <p className="text-sm/tight text-gray-400 md:whitespace-nowrap">
            Built by the following IEEE Members:
          </p>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 md:flex-nowrap md:gap-2">
            {teamMembers.map((member) => (
              <a
                key={member.id || member.login}
                href={member.html_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0"
                title={member.login || "Contributor"}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition duration-500 scale-110"></div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:border-blue-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={member.avatar_url || "/default-avatar.png"}
                      alt={member.login || "Unknown Contributor"}
                      fill
                      sizes="(max-width: 768px) 64px, (max-width: 1024px) 40px, 48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  </div>
                  {member.contributions && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 hidden group-hover:flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white text-[10px] font-bold shadow-lg">
                      {member.contributions}
                    </div>
                  )}
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                  {member.login || "Unknown"}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contributors;
