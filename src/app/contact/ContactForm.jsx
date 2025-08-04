'use client';

import { useState } from 'react';
import { MessageCircle, Rocket, Send, Loader2 } from 'lucide-react';
import { useToast } from './ToastProvider'

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formTouched, setFormTouched] = useState({ name: false, email: false, subject: false, message: false });
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [focusedField, setFocusedField] = useState('');
    const { showToast } = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (!formTouched[name]) {
            setFormTouched((prev) => ({ ...prev, [name]: true }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setFormTouched((prev) => ({ ...prev, [name]: true }));
    };

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const getFieldError = (field) => {
        if (!formTouched[field]) return null;
        if (field === 'name') return formData.name.length < 2 ? 'Name must be at least 2 characters' : null;
        if (field === 'email') {
            if (!formData.email) return 'Email is required';
            if (!isEmailValid(formData.email)) return 'Please enter a valid email address';
            return null;
        }
        if (field === 'subject') return formData.subject.length < 3 ? 'Subject must be at least 3 characters' : null;
        if (field === 'message') return formData.message.length < 10 ? 'Message must be at least 10 characters long' : null;
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormTouched({ name: true, email: true, subject: true, message: true });

        if (getFieldError('name') || getFieldError('email') || getFieldError('subject') || getFieldError('message')) return;

        setIsSending(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setFormTouched({ name: false, email: false, subject: false, message: false });
                setTimeout(() => setIsSuccess(false), 5000);
                showToast('Message sent successfully!', 'success');
            } else {
                const error = await response.json();
                const msg = error.message || 'Something went wrong. Please try again.';
                setErrorMessage(msg);
                showToast(msg, 'error');
            }
        } catch {
            const msg = 'Network error. Please check your connection and try again.';
            setErrorMessage(msg);
            showToast(msg, 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Get In Touch</h2>
            </div>

            {isSuccess ? (
                <div className="text-center p-8 bg-green-50 dark:bg-green-900/30 rounded-2xl h-full flex flex-col justify-center items-center min-h-[400px]">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">Message Sent!</h3>
                    <p className="text-green-600 dark:text-green-400 mt-2">Thank you for your interest. We'll get back to you soon.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => setFocusedField('name')}
                                onBlurCapture={() => setFocusedField('')}
                                placeholder="Your Name"
                                className={`w-full px-6 py-4 bg-gray-50/70 dark:bg-gray-700/70 border-2 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focusedField === 'name'
                                    ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20'
                                    : getFieldError('name')
                                        ? 'border-red-400 bg-red-50 dark:bg-red-400/10'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            />
                            {getFieldError('name') && <p className="mt-1 text-sm text-red-500">{getFieldError('name')}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => setFocusedField('email')}
                                onBlurCapture={() => setFocusedField('')}
                                placeholder="Your Email"
                                className={`w-full px-6 py-4 bg-gray-50/70 dark:bg-gray-700/70 border-2 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focusedField === 'email'
                                    ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20'
                                    : getFieldError('email')
                                        ? 'border-red-400 bg-red-50 dark:bg-red-400/10'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            />
                            {getFieldError('email') && <p className="mt-1 text-sm text-red-500">{getFieldError('email')}</p>}
                        </div>
                    </div>

                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('subject')}
                        onBlurCapture={() => setFocusedField('')}
                        placeholder="Subject"
                        className={`w-full px-6 py-4 bg-gray-50/70 dark:bg-gray-700/70 border-2 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focusedField === 'subject'
                            ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : getFieldError('subject')
                                ? 'border-red-400 bg-red-50 dark:bg-red-400/10'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                    />
                    {getFieldError('subject') && <p className="mt-1 text-sm text-red-500">{getFieldError('subject')}</p>}

                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('message')}
                        onBlurCapture={() => setFocusedField('')}
                        placeholder="Your Message"
                        rows={6}
                        className={`w-full px-6 py-4 bg-gray-50/70 dark:bg-gray-700/70 border-2 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none ${focusedField === 'message'
                            ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : getFieldError('message')
                                ? 'border-red-400 bg-red-50 dark:bg-red-400/10'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                    />
                    {getFieldError('message') && <p className="mt-1 text-sm text-red-500">{getFieldError('message')}</p>}

                    {errorMessage && (
                        <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                            <p className="font-medium mb-1">Error</p>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg"
                    >
                        {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Sending...</span></> : <><Send className="w-5 h-5" /><span>Send Message</span></>}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;