"use client";

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  focused: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-10 py-3 bg-white dark:bg-gray-800 border-2 rounded-lg transition-all
            ${focused
              ? "border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20"
              : error
                ? "border-red-400 bg-red-50 dark:bg-red-400/10"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            text-gray-900 dark:text-gray-100 focus:outline-none
            bg-right bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')]
            bg-[length:20px_20px] bg-[right_0.75rem_center]`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;