"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaHandshake,
  FaChartLine,
  FaTicketAlt,
  FaGraduationCap,
  FaCogs,
  FaStar,
  FaGlobe,
  FaRocket,
  FaUsers,
  FaFlag,
  FaUniversity,
} from "react-icons/fa";

export default function LearnAboutIEEE() {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("about");

  const content = {
    en: {
      title: "Learn About IEEE",
      about: {
        title: "About IEEE",
        description: `IEEE (Institute of Electrical and Electronics Engineers) is the world’s largest and most influential professional organization dedicated to the advancement of technology for the betterment of humanity. Since its founding in 1963, IEEE has been at the forefront of innovation, connecting experts, researchers, and professionals from a wide range of technical fields including electrical and electronics engineering, computer science, biomedical engineering, robotics, telecommunications, artificial intelligence, and many more. 
          
With a global membership of over 400,000 professionals spanning more than 160 countries, IEEE provides an unparalleled platform for knowledge exchange, collaboration, and professional growth. The organization publishes highly cited research papers, journals, and conference proceedings, contributing significantly to the global body of scientific knowledge. IEEE also develops and maintains worldwide technology standards, ensuring interoperability, safety, and innovation across industries.

Beyond research and standards, IEEE is deeply committed to education, mentorship, and community engagement, offering programs, scholarships, workshops, and events that empower students, early-career professionals, and seasoned experts alike. Through its vast network of societies, chapters, and affinity groups, IEEE fosters collaboration and inspires the next generation of innovators to create technology that improves lives, drives progress, and addresses the world’s most pressing challenges.`,
      },
      mission: {
        title: "Mission & Vision",
        description: `IEEE's mission is to foster technological innovation and excellence for the benefit of humanity.`,
        missionList: [
          { icon: <FaHandshake />, text: "Encourage collaboration between academia, industry, and government" },
          { icon: <FaChartLine />, text: "Support research that addresses global challenges" },
          { icon: <FaUniversity />, text: "Provide a platform for knowledge exchange" },
        ],
        vision: {
          icon: <FaRocket />,
          text: "A world where technology is seamlessly integrated into society to solve humanity's greatest challenges — from sustainable energy and healthcare to digital transformation and smart cities.",
        },
      },
      impact: {
        title: "Global Impact",
        list: [
          { icon: <FaBookOpen />, text: "Publishes 30% of the world's literature in electrical and electronics engineering" },
          { icon: <FaCogs />, text: "Develops 1,300+ active standards (including Wi-Fi, Bluetooth, and AI ethics)" },
          { icon: <FaFlag />, text: "Organizes 2,000+ conferences annually worldwide" },
          { icon: <FaGraduationCap />, text: "Provides educational resources to millions of learners" },
          { icon: <FaUsers />, text: "Supports 1,800+ student branches globally, empowering the next generation" },
        ],
      },
      benefits: {
        title: "Membership Benefits",
        list: [
          { icon: <FaBookOpen />, text: "Access to the IEEE Xplore Digital Library (over 5 million documents)" },
          { icon: <FaHandshake />, text: "Professional networking with global experts & innovators" },
          { icon: <FaChartLine />, text: "Career development resources and mentorship" },
          { icon: <FaTicketAlt />, text: "Discounts on international conferences and events" },
          { icon: <FaGraduationCap />, text: "Continuing education with online courses & certifications" },
          { icon: <FaCogs />, text: "Opportunities to contribute to standards development" },
          { icon: <FaStar />, text: "Leadership roles in student branches & technical societies" },
        ],
      },
    },
    bn: {
      title: "আইইইই সম্পর্কে জানুন",
      about: {
        title: "আইইইই সম্পর্কে",
        description: `আইইইই (ইনস্টিটিউট অফ ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক্স ইঞ্জিনিয়ার্স) হল বিশ্বের সর্ববৃহৎ এবং সবচেয়ে প্রভাবশালী পেশাদার সংগঠন, যা প্রযুক্তির উন্নয়ন এবং মানবজাতির কল্যাণে প্রযুক্তি ব্যবহার করার উদ্দেশ্যে কাজ করে। ১৯৬৩ সালে প্রতিষ্ঠিত, আইইইই গবেষণা, উদ্ভাবন এবং পেশাদারদের সংযুক্ত করার ক্ষেত্রে সর্বদা অগ্রণী ভূমিকা পালন করে এসেছে। এটি বিভিন্ন প্রযুক্তিগত ক্ষেত্রে বিশেষজ্ঞদের একত্রিত করে, যার মধ্যে রয়েছে ইলেকট্রিক্যাল ও ইলেকট্রনিক্স ইঞ্জিনিয়ারিং, কম্পিউটার সায়েন্স, বায়োমেডিক্যাল ইঞ্জিনিয়ারিং, রোবোটিক্স, টেলিযোগাযোগ, কৃত্রিম বুদ্ধিমত্তা (AI) এবং আরও অনেক কিছু।

বিশ্বব্যাপী ৪০০,০০০-এর বেশি পেশাজীবী সদস্য সহ আইইইই ১৬০টির বেশি দেশে সক্রিয়। এটি গবেষণা, শিখন এবং পেশাগত উন্নয়নের জন্য একটি অনন্য প্ল্যাটফর্ম প্রদান করে। আইইইই উচ্চ মানের গবেষণা প্রবন্ধ, জার্নাল এবং কনফারেন্স পেপার প্রকাশ করে, যা বৈশ্বিক বৈজ্ঞানিক জ্ঞানের অগ্রগতিতে গুরুত্বপূর্ণ ভূমিকা রাখে। এছাড়াও, আইইইই বিশ্বব্যাপী প্রযুক্তিগত মান নির্ধারণ এবং বজায় রাখে, যা শিল্প ও প্রযুক্তিতে নিরাপত্তা, ইন্টারঅপারেবিলিটি এবং উদ্ভাবন নিশ্চিত করে।

শুধু গবেষণা ও মান নির্ধারণের মধ্যে সীমাবদ্ধ নয়, আইইইই শিক্ষা, পরামর্শ, এবং কমিউনিটি এনগেজমেন্টেও ব্যাপকভাবে যুক্ত। এটি ছাত্রছাত্রী, নতুন পেশাজীবী এবং অভিজ্ঞ বিশেষজ্ঞদের জন্য স্কলারশিপ, ওয়ার্কশপ, কর্মশালা এবং ইভেন্টের মাধ্যমে শিক্ষামূলক ও পেশাগত সুযোগ সৃষ্টি করে। বিভিন্ন সমাজ, চ্যাপ্টার এবং অ্যাফিনিটি গ্রুপের মাধ্যমে আইইইই সহযোগিতা, উদ্ভাবনা এবং আগামীর প্রযুক্তি নেতা গড়ে তুলতে কাজ করে, যার লক্ষ্য হলো প্রযুক্তির মাধ্যমে মানুষের জীবন উন্নয়ন, অগ্রগতি এবং বিশ্বের গুরুত্বপূর্ণ চ্যালেঞ্জ সমাধান করা।`,
      },
      mission: {
        title: "মিশন ও ভিশন",
        missionList: [
          { icon: <FaHandshake />, text: "একাডেমিয়া, শিল্প এবং সরকারের মধ্যে সহযোগিতা বাড়ানো" },
          { icon: <FaChartLine />, text: "বৈশ্বিক চ্যালেঞ্জ মোকাবিলায় গবেষণাকে সহায়তা করা" },
          { icon: <FaUniversity />, text: "জ্ঞান ভাগাভাগির জন্য প্ল্যাটফর্ম তৈরি করা" },
        ],
        vision: {
          icon: <FaRocket />,
          text: "একটি বিশ্ব যেখানে প্রযুক্তি মানবজাতির সবচেয়ে বড় চ্যালেঞ্জ সমাধানে সহায়তা করবে।",
        },
      },
      impact: {
        title: "বৈশ্বিক প্রভাব",
        list: [
          { icon: <FaBookOpen />, text: "বৈদ্যুতিক/ইলেকট্রনিক প্রকৌশলে বিশ্বের সাহিত্যের ৩০% প্রকাশ" },
          { icon: <FaCogs />, text: "১,৩০০+ সক্রিয় মানদণ্ড তৈরি (যেমন Wi-Fi, Bluetooth)" },
          { icon: <FaFlag />, text: "বিশ্বব্যাপী প্রতি বছর ২,০০০+ সম্মেলনের আয়োজন" },
          { icon: <FaGraduationCap />, text: "লক্ষ লক্ষ শিক্ষার্থীর জন্য শিক্ষামূলক সম্পদ প্রদান" },
          { icon: <FaUsers />, text: "১,৮০০+ ছাত্র শাখা বিশ্বব্যাপী সক্রিয়" },
        ],
      },
      benefits: {
        title: "সদস্যতার সুবিধা",
        list: [
          { icon: <FaBookOpen />, text: "IEEE Xplore ডিজিটাল লাইব্রেরি অ্যাক্সেস" },
          { icon: <FaHandshake />, text: "বিশ্বব্যাপী বিশেষজ্ঞদের সাথে নেটওয়ার্কিং সুযোগ" },
          { icon: <FaChartLine />, text: "ক্যারিয়ার উন্নয়ন সম্পদ ও মেন্টরশিপ" },
          { icon: <FaTicketAlt />, text: "আন্তর্জাতিক কনফারেন্সে ছাড়" },
          { icon: <FaGraduationCap />, text: "অনলাইন কোর্স ও সার্টিফিকেশন" },
          { icon: <FaCogs />, text: "মানদণ্ড উন্নয়নে অংশগ্রহণের সুযোগ" },
          { icon: <FaStar />, text: "ছাত্র শাখা ও টেকনিক্যাল সোসাইটিতে নেতৃত্বের সুযোগ" },
        ],
      },
    },
  };

  const tabs = ["about", "mission", "impact", "benefits"];

  return (
    <section className="h-screen sm:mt-14 w-full bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950 py-4 px-3 sm:px-6">
     <div className="mt-18 md:mt-0 w-full max-w-7xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20 dark:border-emerald-900/40">

        {/* Improved Header Section */}
        <div className="mb-8 sm:mb-12">
          {/* Top Row with Title and Language Switch */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Title Section - Centered on mobile, left on larger screens */}
            <div className="text-center sm:text-left w-full sm:w-auto ">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
                {content[language].title}
              </h1>
              <p className="text-green-600 dark:text-emerald-300 text-xs sm:text-sm md:text-base mt-1 sm:mt-2 font-medium">
                {language === "en" 
                  ? "World's Largest Technical Professional Organization" 
                  : "বিশ্বের বৃহত্তম প্রযুক্তিগত পেশাদার সংগঠন"
                }
              </p>
            </div>

            {/* Language Switch - Better responsive design */}
            <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-1 sm:p-2 border border-green-200 dark:border-emerald-800 shadow-lg w-full sm:w-auto">
              <div className="flex gap-1 justify-center sm:justify-start">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm ${
                    language === "en"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-emerald-900/40 hover:text-green-700 dark:hover:text-emerald-200"
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm ${
                    language === "bn"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-emerald-900/40 hover:text-green-700 dark:hover:text-emerald-200"
                  }`}
                >
                  <span>🇧🇩</span>
                  <span>BN</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Improved responsive design */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px] justify-center flex-1 sm:flex-none ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-emerald-900/40 hover:text-green-700 dark:hover:text-emerald-200 border border-green-100 dark:border-emerald-900 shadow-sm"
                }`}
              >
                {tab === "about" && <FaBookOpen className="text-xs sm:text-sm" />}
                {tab === "mission" && <FaRocket className="text-xs sm:text-sm" />}
                {tab === "impact" && <FaGlobe className="text-xs sm:text-sm" />}
                {tab === "benefits" && <FaStar className="text-xs sm:text-sm" />}
                <span className="hidden xs:inline">
                  {content[language][tab]?.title || tab}
                </span>
                <span className="xs:hidden">
                  {tab === "about" ? "About" : 
                   tab === "mission" ? "Mission" : 
                   tab === "impact" ? "Impact" : "Benefits"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Section - Full responsive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${language}-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-[300px] sm:min-h-[400px]"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-green-100 dark:border-emerald-900 shadow-inner">
              {/* Content Header with Icon */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-green-200 dark:border-emerald-900">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  {activeTab === "about" && <FaBookOpen className="text-white text-sm sm:text-base md:text-lg" />}
                  {activeTab === "mission" && <FaRocket className="text-white text-sm sm:text-base md:text-lg" />}
                  {activeTab === "impact" && <FaGlobe className="text-white text-sm sm:text-base md:text-lg" />}
                  {activeTab === "benefits" && <FaStar className="text-white text-sm sm:text-base md:text-lg" />}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {content[language][activeTab]?.title}
                </h2>
              </div>

              {/* About */}
              {activeTab === "about" && (
                <motion.p 
                  className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {content[language][activeTab]?.description}
                </motion.p>
              )}

              {/* Mission */}
              {activeTab === "mission" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 font-medium">
                    {content[language][activeTab]?.description}
                  </p>
                  <ul className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                    {content[language][activeTab].missionList.map(
                      (item, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-slate-900/60 border border-green-100 dark:border-emerald-900"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                          <span className="text-green-600 text-lg sm:text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item.text}</span>
                        </motion.li>
                      )
                    )}
                  </ul>
                  <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950 rounded-lg sm:rounded-xl border-l-4 border-green-500">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="text-green-600 text-xl sm:text-2xl flex-shrink-0">
                        {content[language][activeTab].vision.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-green-700 dark:text-emerald-300 mb-1 sm:mb-2 text-base sm:text-lg">
                          {language === "en" ? "Our Vision" : "আমাদের ভিশন"}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                          {content[language][activeTab].vision.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Impact & Benefits */}
              {(activeTab === "impact" || activeTab === "benefits") && (
                <motion.ul 
                  className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {content[language][activeTab].list.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/70 dark:bg-slate-900/70 border border-green-100 dark:border-emerald-900 shadow-sm hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <span className="text-green-600 text-lg sm:text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{item.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

       

       
      </div>
    </section>
  );
}
