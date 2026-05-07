'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Globe,
  GraduationCap,
  Handshake,
  Mail,
  Sparkles,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Quote
} from 'lucide-react';
import membership from '@/data/membership.json';
import { submitApplicationAction } from '@/app/actions/submitApplication';

// --- PLACEHOLDER DATA FOR PAST LEADERS ---
// You can easily change the names, roles, and quotes here later!
const pastLeadersRow1 = [
  { name: "Faysal Hossain Tomal", role: "Former Chair", img: "FR", quote: "IEEE GUB SB gave me the leadership edge I needed. It completely transformed my career trajectory!" },
  { name: "Sadia Islam", role: "Former Secretary", img: "SI", quote: "The global networking and mentorship here are unmatched. My best university experience." },
  { name: "Tanvir Hasan", role: "Former Treasurer", img: "TH", quote: "From organizing events to technical workshops, it prepared me for the real tech industry." },
];

const pastLeadersRow2 = [
  { name: "Nadia Afrin", role: "Former Org. Sec", img: "NA", quote: "I learned how to manage massive events and build lifelong friendships." },
  { name: "Mehedi Hasan", role: "Former Vice Chair", img: "MH", quote: "The platform pushed me out of my comfort zone and made me a confident public speaker." },
  { name: "Jannatul F.", role: "Former Pub. Sec", img: "JF", quote: "A stepping stone that connected me directly with industry professionals and alumni." },
];

const JoinPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'PDF must be under 2MB.' });
        e.target.value = '';
        setFileName('');
      } else {
        setFileName(file.name);
        setFeedback({ type: '', message: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    const form = e.target;

    if (!form.semester.value || !form.position.value || !form.consent.value) {
      setFeedback({ type: 'error', message: 'Please ensure all dropdown menus are selected.' });
      setIsSubmitting(false);
      return;
    }

    const fileInput = form.cv;
    let cvData = null;
    
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      try {
        cvData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: file.name,
            mimeType: file.type,
            base64: reader.result.split(',')[1]
          });
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });
      } catch (err) {
        setFeedback({ type: 'error', message: 'Failed to read the PDF file. Please try again.' });
        setIsSubmitting(false);
        return;
      }
    }

    const data = {
      name: form.name.value.trim(),
      studentId: form.studentId.value.trim(),
      email: form.email.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      presentAddress: form.presentAddress.value.trim(),
      cgpa: parseFloat(form.cgpa.value),
      credits: parseFloat(form.credits.value),
      semester: form.semester.value,
      position: form.position.value,
      motivation: form.motivation.value.trim(),
      consent: form.consent.value,
      cv: cvData
    };

    try {
      const result = await submitApplicationAction(data);

      if (result.success) {
        setFeedback({ type: 'success', message: 'Application Submitted Successfully!' });
        form.reset();
        setFileName('');
      } else {
        setFeedback({ type: 'error', message: result.error || 'Validation failed. Please check your inputs.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'A network error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/50 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 px-4 sm:px-6 font-sans text-gray-900 dark:text-gray-100">
      
      {/* Custom CSS for Marquee Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 30s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: scrollRight 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="rounded-3xl border border-gray-200/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-2xl backdrop-blur-sm px-6 py-10 sm:px-10 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                <Sparkles className="h-4 w-4" />
                IEEE Student Branch - Green University of Bangladesh
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Join IEEE GUB and Shape Your Leadership journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                Become part of a global IEEE network while growing locally through IEEE GUB events, mentorship,
                and leadership opportunities.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gray-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 shadow-sm">IEEE SB</span>
                <span className="rounded-full border border-gray-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 shadow-sm">IEEE CS</span>
                <span className="rounded-full border border-gray-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 shadow-sm">IEEE PES</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={membership.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 transition-all active:scale-95"
                >
                  Join IEEE (Global)
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-xl space-y-5 relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Membership at a glance
              </h2>
              <div className="space-y-3 relative z-10">
                {membership.fees.map((fee, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 p-4 flex items-start justify-between gap-3 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fee.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Annual</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">{fee.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-lg dark:bg-slate-900 dark:border-slate-800 space-y-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100 dark:border-blue-900/50">
              <Globe className="h-4 w-4" /> Global Access
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why IEEE GUB?</h2>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              {membership.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span className="leading-relaxed font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-lg dark:bg-slate-900 dark:border-slate-800 space-y-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-100 dark:border-emerald-900/50">
              <GraduationCap className="h-4 w-4" /> Next Steps
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to join</h2>
            <ol className="space-y-5 text-sm text-gray-600 dark:text-gray-300">
              {membership.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shrink-0 shadow-md">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed pt-1.5 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Dynamic & Professional Form Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-start justify-between gap-12 border border-slate-800">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]"></div>
            <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-teal-600/20 blur-[100px]"></div>
          </div>

          {/* LEFT SIDE: Titles and Testimonials */}
          <div className="relative z-10 w-full lg:w-[40%] space-y-8 text-white lg:sticky lg:top-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                <Users className="h-4 w-4" /> Local Community
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight">Ready to join IEEE GUB Student Branch?</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Fill out this form to apply for local Student Branch and chapter opportunities. Ensure your CV is up to date.
              </p>
            </div>

            {/* Testimonial Marquees replacing the blank space */}
            <div className="pt-6 w-full overflow-hidden marquee-container relative mask-fade-edges">
              {/* Top fade mask for testimonials */}
              <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none"></div>
              
              <div className="space-y-4">
                {/* Row 1 - Slides Left */}
                <div className="animate-marquee-left gap-4">
                  {[...pastLeadersRow1, ...pastLeadersRow1].map((leader, i) => (
                    <div key={i} className="w-[280px] shrink-0 bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl">
                      <Quote className="h-5 w-5 text-emerald-500 mb-2 opacity-50" />
                      <p className="text-sm text-slate-300 italic mb-4 line-clamp-3">"{leader.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-700/50">
                          {leader.img}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{leader.name}</p>
                          <p className="text-xs text-emerald-400 font-medium">{leader.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2 - Slides Right */}
                <div className="animate-marquee-right gap-4">
                  {[...pastLeadersRow2, ...pastLeadersRow2].map((leader, i) => (
                    <div key={i} className="w-[280px] shrink-0 bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl">
                      <Quote className="h-5 w-5 text-emerald-500 mb-2 opacity-50" />
                      <p className="text-sm text-slate-300 italic mb-4 line-clamp-3">"{leader.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-900 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-700/50">
                          {leader.img}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{leader.name}</p>
                          <p className="text-xs text-teal-400 font-medium">{leader.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Secure Floating Form Card */}
          <form onSubmit={handleSubmit} className="relative z-10 w-full lg:w-[90%] space-y-9 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl text-gray-900 dark:text-gray-100">
            
            <div className="border-b border-gray-100 dark:border-slate-800 pb-5 mb-5">
              <h4 className="font-extrabold text-2xl text-gray-900 dark:text-white">Local Application Form</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fields marked with <span className="text-red-500 font-bold">*</span> are required.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  placeholder="e.g. John Doe" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  minLength={3}
                  onInput={(e) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input 
                  name="studentId" 
                  placeholder="e.g. 242002029" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  inputMode="numeric"
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  name="email" 
                  type="email"
                  placeholder="e.g. john@student.green.ac.bd" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input 
                  name="whatsapp" 
                  placeholder="e.g. 015XXXXXXXX" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  inputMode="numeric"
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Present Address <span className="text-red-500">*</span>
              </label>
              <input 
                name="presentAddress" 
                placeholder="e.g. Mirpur, Dhaka" 
                className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                required 
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  CGPA <span className="text-red-500">*</span>
                </label>
                <input 
                  name="cgpa" 
                  type="number" 
                  step="0.01" 
                  min="3.00" max="4.00"
                  placeholder="e.g. 3.80" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Credits Completed <span className="text-red-500">*</span>
                </label>
                <input 
                  name="credits" 
                  type="number" 
                  step="0.5" min="0"
                  placeholder="e.g. 35" 
                  className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Current Semester <span className="text-red-500">*</span>
                </label>
                <select name="semester" required disabled={isSubmitting} className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer">
                  <option value="">Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                  <option value="9th Semester">9th Semester</option>
                  <option value="10th Semester">10th Semester</option>
                  <option value="11th Semester">11th Semester</option>
                  <option value="12th Semester">12th Semester</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Position <span className="text-red-500">*</span>
                </label>
                <select name="position" required disabled={isSubmitting} className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer">
                  <option value="">Select Position</option>
                  <option value="Chair">Chair</option>
                  <option value="Vice Chair">Vice Chair</option>
                  <option value="General Secretary">General Secretary</option>
                  <option value="Joint Secretary">Joint Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Organizing Secretary">Organizing Secretary</option>
                  <option value="Joint Organizing Secretary">Joint Organizing Secretary</option>
                  <option value="Publication">Publication</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Motivation to Join IEEE<span className="text-red-500">*</span>
              </label>
              <textarea 
                name="motivation" 
                rows="3"
                placeholder="Briefly explain why you want to join IEEE GUB Student Branch..." 
                className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" 
                required 
                disabled={isSubmitting}
              />
            </div>

            {/* Custom File Upload UI */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Upload Your CV (PDF) <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  name="cv" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  required 
                  disabled={isSubmitting}
                />
                <div className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${fileName ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 group-hover:bg-gray-100 dark:group-hover:bg-slate-700'}`}>
                  <UploadCloud className={`h-8 w-8 ${fileName ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'}`} />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center px-4">
                    {fileName ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">{fileName}</span> : 'Click or drag to upload your CV (Max 2MB)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 pt-6">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Data Consent <span className="text-red-500">*</span>
              </label>
              <select name="consent" required disabled={isSubmitting} className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer">
                <option value="">Do you agree to the terms?</option>
                <option value="Yes">Yes, I agree to share my details with IEEE GUB.</option>
              </select>
            </div>

            {/* Dynamic Feedback Message */}
            {feedback.message && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold mt-4 ${
                feedback.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400'
              }`}>
                {feedback.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
                <p>{feedback.message}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white font-bold text-lg px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 mt-4 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing Upload...
                </>
              ) : (
                'Submit Your Application'
              )}
            </button>
          </form>

        </section>
      </div>
    </div>
  );
};

export default JoinPage;