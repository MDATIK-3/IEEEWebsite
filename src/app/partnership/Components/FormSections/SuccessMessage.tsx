import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
    onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20 flex items-center justify-center p-4">
        <div
            className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center"
            role="alert"
            aria-live="polite"
        >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Application Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Thank you for your interest in partnering with IEEE GUB. We've received your application
                and our team will review it shortly. We'll get back to you within 3-5 business days.
            </p>
            <button
                onClick={onReset}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Submit Another Application
            </button>
        </div>
    </div>
);

export default SuccessMessage;