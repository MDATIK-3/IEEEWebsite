interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div
        className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
        role="alert"
    >
        <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
    </div>
);

export default ErrorMessage;