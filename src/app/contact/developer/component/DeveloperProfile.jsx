'use client';
import Image from 'next/image';
import { Facebook, Github, Linkedin, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SocialIcon from './SocialIcon';

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }
    }
};

const hoverVariants = {
    hover: {
        y: -8, scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(20,184,166,0.1)",
        transition: { duration: 0.3, ease: "easeOut", type: "tween" }
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1, ease: "easeOut" }
    }
};

const DeveloperProfile = ({ dev, index }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className="relative bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-slate-700 will-change-transform"
            variants={cardVariants}
            whileHover={shouldReduceMotion ? undefined : "hover"}
            whileTap={shouldReduceMotion ? undefined : "tap"}
            style={{
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
                perspective: "1000px"
            }}
            {...hoverVariants}
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                }}
                style={{ transformOrigin: "left center" }}
            />

            <div className="flex justify-center pt-12 pb-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 blur-sm opacity-75" />
                    <Image
                        src={dev.image}
                        alt={dev.name}
                        width={120}
                        height={120}
                        className="relative rounded-full object-cover border-4 border-white dark:border-slate-800 z-10 select-none pointer-events-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>
            </div>

            <motion.div
                className="px-6 pb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: index * 0.1 + 0.2,
                    ease: "easeOut"
                }}
            >
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{dev.name}</h4>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-700/50 py-2 px-3 rounded-full inline-block mb-4">
                    {dev.developer_type}
                </p>

                <motion.div
                    className="flex justify-center space-x-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.4,
                        delay: index * 0.1 + 0.3,
                        ease: "easeOut"
                    }}
                >
                    {dev.facebook && (
                        <SocialIcon href={dev.facebook}><Facebook /></SocialIcon>
                    )}
                    {dev.linkedin && (
                        <SocialIcon href={dev.linkedin}><Linkedin /></SocialIcon>
                    )}
                    {dev.github && (
                        <SocialIcon href={dev.github}><Github /></SocialIcon>
                    )}
                    {dev.email && (
                        <SocialIcon href={`mailto:${dev.email}`}><Mail /></SocialIcon>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default DeveloperProfile;
