'use client';
import Image from 'next/image';
import { Facebook, Github, Linkedin } from 'lucide-react';
import developerData from "@/data/developerData.json";

const DeveloperCard = () => {
  const projectLeads = developerData.filter((dev) => dev.id === 1 || dev.id === 2);
  const allDevelopers = developerData;

 const DeveloperProfile = ({ dev }) => (
  <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-shadow pt-16 pb-6 px-6">
    
    {/* Image positioned half outside */}
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
      <Image
        src={dev.image}
        alt={dev.name}
        width={96}
        height={96}
        className="rounded-full object-cover ring-4 ring-green-500 transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Content */}
    <div className="flex flex-col items-center text-center space-y-4 mt-4">
      <h4 className="text-xl font-semibold text-zinc-800 dark:text-white">{dev.name}</h4>
      <p className="text-sm font-extrabold text-gray-600 dark:text-green-400">{dev.developer_type}</p>
      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Batch: {dev.batch}</p>

      <div className="flex justify-center gap-4 mt-2 text-gray-500 dark:text-green-400">
        <a href={dev.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="w-5 h-5 hover:text-blue-600 transition-colors" />
        </a>
        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="w-5 h-5 hover:text-blue-500 transition-colors" />
        </a>
        <a href={dev.github} target="_blank" rel="noopener noreferrer">
          <Github className="w-5 h-5 hover:text-gray-800 dark:hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  </div>
);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
          Developed by IEEE GUB Website Development Team
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          We’re a dynamic group of individuals who are passionate about what we do.
        </p>
        <h3 className="text-xl font-bold text-gray-600 dark:text-green-400 mt- pb-8">Project Lead</h3>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projectLeads.map((dev) => (
            <DeveloperProfile key={dev.id} dev={dev} />
          ))}
        </div>
      </section>

      <section className="text-center space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white pb-10">Meet Our Developers</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {allDevelopers.map((dev) => (
            <DeveloperProfile key={dev.id} dev={dev} />
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default DeveloperCard;


