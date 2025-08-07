'use client';
import { motion, useReducedMotion } from 'framer-motion';

const SectionHeader = ({ title, color = 'text-gray-800 dark:text-white', delay = 0 }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0.3 : 0.8,
                delay: shouldReduceMotion ? 0 : delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12"
        >
            <h3 className={`text-2xl sm:text-3xl font-semibold ${color} mb-4`}>{title}</h3>
            <motion.div
                className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{
                    duration: 0.6,
                    delay: delay + 0.2,
                    ease: "easeOut"
                }}
                style={{ transformOrigin: "center center" }}
            />
        </motion.div>
    );
};

export default SectionHeader;