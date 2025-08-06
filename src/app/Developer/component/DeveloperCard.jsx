'use client';
import Image from 'next/image';
import { Facebook, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import developerData from "@/data/developerData.json";

const DeveloperCard = () => {
  const projectLeads = developerData.filter(dev => dev.id === 221902046 || dev.id === 221002297);
  const allDevelopers = developerData;

  const DeveloperProfile = ({ dev }) => (
    <motion.div 
      className="relative bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-slate-700"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
      
      {/* Profile image */}
      <div className="flex justify-center pt-12 pb-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 blur-sm opacity-75"></div>
          <Image
            src={dev.image}
            alt={dev.name}
            width={100}
            height={100}
            className="relative rounded-full object-cover border-4 border-white dark:border-slate-800 z-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8 text-center">
        <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{dev.name}</h4>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-700/50 py-2 px-3 rounded-full inline-block mb-2">
          {dev.developer_type}
        </p>
        

        <div className="flex justify-center space-x-4">
          <a href={dev.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
          </a>
          <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400" />
          </a>
          <a href={dev.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Github className="w-5 h-5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
      {/* Project Leads Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            IEEE GUB Website Development Team
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're a passionate team dedicated to building exceptional digital experiences through innovative solutions.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-12">Project Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projectLeads.map((dev) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DeveloperProfile dev={dev} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Team Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Development Team</h3>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allDevelopers.map((dev, index) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DeveloperProfile dev={dev} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DeveloperCard;