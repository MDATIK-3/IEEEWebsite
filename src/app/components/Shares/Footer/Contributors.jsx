'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Contributors() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/MDATIK-3/IEEEWebsite/contributors', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json'
          }
        });

        if (!response.ok) throw new Error(`Failed to fetch (status: ${response.status})`);

        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        console.error("Error fetching contributors:", err);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="border-t border-gray-200 p-2 mt-6">
      <div className="text-center space-y-1 md:space-y-0">
        <div className="md:flex md:items-center md:justify-center md:gap-4 md:flex-wrap lg:flex-nowrap">
          <p className="text-xs sm:text-sm text-gray-600 md:whitespace-nowrap">
            © {new Date().getFullYear()} Green University IEEE Student Branch. All rights reserved.
          </p>

          <p className="text-sm/tight text-gray-400 md:whitespace-nowrap">
            Built by the following IEEE Members:
          </p>

          <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 md:flex-nowrap md:gap-2">
            {teamMembers.map((member) => (
              <Link
                key={member.id}
                href={member.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0"
                title={member.login}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition duration-500 scale-110"></div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:border-blue-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={member.avatar_url}
                      alt={member.login}
                      fill
                      sizes="(max-width: 768px) 64px, (max-width: 1024px) 40px, 48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 hidden group-hover:flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white text-[10px] font-bold shadow-lg">
                    {member.contributions}
                  </div>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                  {member.login}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contributors;