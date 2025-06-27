import { useState, useEffect } from 'react';

export default function LoadingState() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(90);
        }, 1);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="relative">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                </div>

                <div className="w-64">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-gray-900 font-medium">Loading page content</p>
                    <p className="text-sm text-gray-500">This won't take long</p>
                </div>
            </div>
        </div>
    );
}