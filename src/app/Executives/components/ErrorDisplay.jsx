"use client";

const ErrorDisplay = ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-8 max-w-md shadow-lg">
            <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Data</div>
            <p className="text-gray-600">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Retry
            </button>
        </div>
    </div>
);

export default ErrorDisplay;
