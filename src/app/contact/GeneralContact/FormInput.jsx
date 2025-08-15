'use client';

const FormInput = ({ name, value, onChange, onBlur, onFocus, placeholder, error, focused }) => {
    return (
        <div className="w-full">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder}
                className={`w-full px-6 py-4 bg-gray-50/70 dark:bg-gray-700/70 border-2 rounded-2xl transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focused
                    ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : error
                        ? 'border-red-400 bg-red-50 dark:bg-red-400/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;
