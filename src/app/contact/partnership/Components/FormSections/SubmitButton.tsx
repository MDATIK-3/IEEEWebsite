import { Send, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
    isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => (
    <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
    >
        {isSubmitting ? (
            <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Submitting Application...</span>
            </>
        ) : (
            <>
                <Send className="w-6 h-6" />
                <span>Submit Partnership Application</span>
            </>
        )}
    </button>
);

export default SubmitButton;