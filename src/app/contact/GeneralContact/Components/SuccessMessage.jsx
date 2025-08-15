import { Rocket } from 'lucide-react';

const SuccessMessage = () => (
    <div className="text-center p-8 bg-green-50 dark:bg-green-900/30 rounded-2xl h-full flex flex-col justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Rocket className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">Message Sent!</h3>
        <p className="text-green-600 dark:text-green-400 mt-2">Thank you for your interest. We'll get back to you soon.</p>
    </div>
);

export default SuccessMessage;
