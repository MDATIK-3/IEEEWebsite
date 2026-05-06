'use client';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import FormInput from './Components/FormInput';
import FormTextarea from './Components/FormTextarea';
import SuccessMessage from './Components/SuccessMessage';
import { useContactForm } from '@/app/hooks/useContactForm';

const ContactForm = () => {
    const {
        formData,
        handleChange,
        handleBlur,
        focusedField,
        setFocusedField,
        getFieldError,
        handleSubmit,
        isSending,
        isSuccess,
        errorMessage,
    } = useContactForm();

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Get In Touch</h2>
            </div>

            {isSuccess ? (
                <SuccessMessage />
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => setFocusedField('name')}
                            placeholder="Your Name"
                            error={getFieldError('name')}
                            focused={focusedField === 'name'}
                        />
                        <FormInput
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => setFocusedField('email')}
                            placeholder="Your Email"
                            error={getFieldError('email')}
                            focused={focusedField === 'email'}
                        />
                    </div>

                    <FormInput
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('subject')}
                        placeholder="Subject"
                        error={getFieldError('subject')}
                        focused={focusedField === 'subject'}
                    />

                    <FormTextarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('message')}
                        placeholder="Your Message"
                        error={getFieldError('message')}
                        focused={focusedField === 'message'}
                    />

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
