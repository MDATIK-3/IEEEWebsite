import { Clock, Phone, Mail, Navigation } from 'lucide-react';
import contactInfo from "@/data/contactInfo.json";

const iconMap = {
    Phone,
    Mail,
    Clock,
    Navigation
};

function BranchInfoCards() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => {
                const Icon = iconMap[item.icon];
                return (
                    <div
                        key={index}
                        className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 cursor-pointer transform hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-700/30 dark:to-transparent rounded-3xl"></div>
                        <div className="relative flex items-center space-x-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                                {Icon && <Icon className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">
                                    {item.title}
                                </h3>
                                <p className="text-gray-900 dark:text-white text-sm font-medium">
                                    {item.primary}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default BranchInfoCards;
