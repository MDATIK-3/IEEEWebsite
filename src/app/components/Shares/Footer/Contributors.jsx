'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Contributors() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/MDATIK-3/IEEEWebsite/contributors');
        if (!response.ok) {
          throw new Error(`Failed to fetch team members (status: ${response.status})`);
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    }
    fetchTeamMembers();
  }, []);

  return (
    <div className="border-t border-gray-200 p-4 lg:mt-6 pt-6">
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          © {new Date().getFullYear()} Green University IEEE Student Branch. All rights reserved.
        </p>

        <div className="space-y-3">
          <p className="text-sm sm:text-base font-medium text-gray-700">
            Built with ❤️ by the following IEEE Members:
          </p>

          <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3">
            {teamMembers.map((member) => (
              <Link
                key={member.id}
                href={member.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                title={member.login}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 relative rounded-full overflow-hidden border-2 border-gray-300 shadow-sm hover:border-gray-500 transition-all duration-200 hover:scale-110">
                  <Image
                    src={member.avatar_url}
                    alt={member.login}
                    fill
                    sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
                    className="object-cover"
                    priority
                  />
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
  )
}

export default Contributors;
