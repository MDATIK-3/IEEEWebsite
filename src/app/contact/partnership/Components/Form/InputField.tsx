"use client";

interface InputFieldProps {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    icon?: React.ComponentType<{ className?: string }>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    error?: string;
    focused: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    type = "text",
    required = false,
    placeholder,
    icon: Icon,
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

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                )}
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-lg transition-all
                        ${focused
                            ? "border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20"
                            : error
                                ? "border-red-400 bg-red-50 dark:bg-red-400/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }
                        text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none`}
                />
            </div>
            {error && (
                <p id={`${name}-error`} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
