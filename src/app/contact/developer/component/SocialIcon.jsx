'use client';
import { motion } from 'framer-motion';

const SocialIcon = ({ href, children }) => {
    const isEmail = href.startsWith('mailto:');

    const handleClick = (e) => {
        if (isEmail) {
            e.preventDefault();
            const email = href.replace('mailto:', '');
            window.open(`https://mail.google.com/mail/?view=cm&to=${email}`, '_blank');
        }
    };

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
                type: "tween"
            }}
            style={{ backfaceVisibility: "hidden" }}
        >
            {children}
        </motion.a>
    );
};

export default SocialIcon;
