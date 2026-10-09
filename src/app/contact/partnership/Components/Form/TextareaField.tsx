"use client";

interface TextareaFieldProps {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    rows?: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    error?: string;
    focused: boolean;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
    name,
    label,
    required = false,
    placeholder,
    rows = 4,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    focused,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                rows={rows}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-lg transition-all resize-y
          ${focused
                        ? "border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20"
                        : error
                            ? "border-red-400 bg-red-50 dark:bg-red-400/10"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }
          text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none`}
            />
            {error && (
                <p id={`${name}-error`} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default TextareaField;
