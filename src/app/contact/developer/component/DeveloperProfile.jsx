'use client';

import Image from 'next/image';
import { Github, Facebook, Linkedin, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SocialIcon from './SocialIcon';

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const hoverVariants = {
    hover: {
        y: -6,
        scale: 1.01,
        boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(20,184,166,0.15)',
        transition: { duration: 0.3, ease: 'easeOut' },
    },
    tap: { scale: 0.99, transition: { duration: 0.1, ease: 'easeOut' } },
};

const DeveloperProfile = ({ dev, index }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all overflow-visible border border-gray-200 dark:border-slate-800"
            variants={cardVariants}
            whileHover={shouldReduceMotion ? undefined : 'hover'}
            whileTap={shouldReduceMotion ? undefined : 'tap'}
            {...hoverVariants}
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-emerald-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                style={{ transformOrigin: 'left center' }}
            />

            <div className="flex justify-center pt-8 pb-4 relative overflow-visible">
                <div className="relative group">
                    <Image
                        src={
                            dev.avatar_url
                                ? `${dev.avatar_url}?t=${new Date().getTime()}`
                                : '/images/default-avatar.png'
                        }
                        alt={dev.name || dev.login}
                        width={100}
                        height={100}
                        className="rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md select-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />

                    <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                       bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
                       text-gray-900 dark:text-gray-100 text-sm rounded-xl 
                       px-4 py-3 shadow-xl border-b-4 border-teal-500
                       opacity-0 translate-y-2 group-hover:opacity-100 group-hover:-translate-y-0
                       transition-all duration-300 ease-out space-y-2 w-44 z-50"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div className="flex justify-between">
                            <span className="font-semibold">Batch:</span>
                            <span className="font-normal">{dev.batch || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Contributions:</span>
                            <span className="font-normal">{dev.contributions || 'N/A'}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="px-6 pb-6 text-center">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {dev.name || dev.login}
                </h4>

                <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm">
                    {dev.developer_type}
                </span>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                    "{dev.bio || 'No bio available'}"
                </p>

                <div className="flex justify-center space-x-3">
                    <SocialIcon href={dev.html_url}>
                        <Github className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400" />
                    </SocialIcon>
                    {dev.facebook && (
                        <SocialIcon href={dev.facebook}>
                            <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400" />
                        </SocialIcon>
                    )}
                    {dev.linkedin && (
                        <SocialIcon href={dev.linkedin}>
                            <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400" />
                        </SocialIcon>
                    )}
                    {dev.email && (
                        <SocialIcon href={`mailto:${dev.email}`}>
                            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400" />
                        </SocialIcon>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DeveloperProfile;
