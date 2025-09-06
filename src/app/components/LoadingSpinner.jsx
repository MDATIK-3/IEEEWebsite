export default function LoadingState() {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="relative">
                    <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                </div>

                <div className="w-64">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 rounded-full transition-all duration-300"
                        ></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-gray-400 font-medium">Loading page content</p>
                    <p className="text-lg text-green-800">This won't take long</p>
                </div>
            </div>
        </div>
    );
}