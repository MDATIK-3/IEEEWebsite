import { Handshake } from "lucide-react";
import Wave from "@/app/components/Shares/Wave"

const Header = () => {
    return (
        <header className="relative bg-white dark:bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 dark:from-emerald-800/20 dark:via-green-800/20 dark:to-teal-800/20"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-300/20 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-24">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-200 text-sm font-medium shadow-lg border border-white/50 dark:border-gray-700/50">
                        <Handshake className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                        Partnership Opportunities
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-600 to-green-700 dark:from-white dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent leading-tight">
                        Partner With IEEE GUB
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Join us in empowering the next generation of engineers and innovators. Collaborate with
                        Bangladesh's largest IEEE Student Branch and make a lasting impact on technology
                        education.
                    </p>
                </div>
            </div>
            <Wave />
        </header>
    )
}

export default Header;