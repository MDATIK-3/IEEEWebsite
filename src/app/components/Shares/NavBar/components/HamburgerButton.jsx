'use client';

export default function HamburgerButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={open}
      className="lg:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
        />
      </svg>
    </button>
  );
}