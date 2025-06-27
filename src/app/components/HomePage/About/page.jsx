'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
    { number: '3000+', label: 'Active Members', icon: '👥' },
    { number: '50+', label: 'Annual Events', icon: '📅' },
    { number: '10+', label: 'Years Active', icon: '🏆' },
];

const coreValues = [
    { icon: '🤝', title: 'Collaboration', desc: 'Working together for impact' },
    { icon: '🚀', title: 'Innovation', desc: 'Creative solutions for tomorrow' },
    { icon: '📖', title: 'Learning', desc: 'Continuous skill development' },
    { icon: '🌍', title: 'Global Vision', desc: 'Worldwide engineering network' },
];

const activities = [
    'Workshops',
    'Tech Talks',
    'Coding Sessions',
    'Projects',
    'Mentorship',
    'Competitions',
    'Networking',
];

const About = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });


    return (
        <section
            ref={sectionRef}
            className="pt-24 pb-20 bg-gradient-to-b from-green-50/70 via-green-50/40 to-green-50/50 text-gray-800 overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 40 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16"
            >
                <div className="flex-1 flex flex-col justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
                    >
                        Empowering Future <br />
                        <span className="text-green-600">Engineers</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed"
                    >
                        IEEE Student Branch is a vibrant community of{' '}
                        <strong className="text-green-600">3000+ passionate members</strong> dedicated to
                        innovation, learning, and professional growth in electrical and computer engineering.
                    </motion.p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="text-center p-6 bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl shadow-md hover:shadow-lg transition-all"
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-green-600">{stat.number}</div>
                                <div className="text-gray-700 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-green-100/60 border border-green-200 p-6 md:p-8 rounded-2xl shadow-inner"
                    >
                        <h3 className="text-2xl font-bold text-green-800 mb-3">Our Mission</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            We conduct workshops, tech talks, coding sessions, and real-world projects that build
                            leadership, teamwork, and hands-on engineering skills for tomorrow's innovators.
                        </p>
                    </motion.div>
                </div>

                {/* Sidebar */}
                <aside className="w-full lg:w-96 flex-shrink-0 space-y-12">
                    {/* Core Values */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-5">Core Values</h3>
                        <div className="space-y-4">
                            {coreValues.map((val, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-start gap-4 p-5 bg-white/80 border border-gray-200 rounded-xl shadow hover:shadow-md transition"
                                >
                                    <div className="text-2xl">{val.icon}</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{val.title}</h4>
                                        <p className="text-sm text-gray-600">{val.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Activities */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-5">What We Do</h3>
                        <div className="flex flex-wrap gap-2">
                            {activities.map((activity, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + i * 0.05 }}
                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition cursor-pointer"
                                >
                                    {activity}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </aside>
        </motion.div>
    </section >
  );
};

export default About;
