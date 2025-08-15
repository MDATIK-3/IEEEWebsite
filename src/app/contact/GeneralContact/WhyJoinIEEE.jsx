import { Award, Lightbulb, Rocket, Users } from 'lucide-react';

const WhyJoinIEEE = () => {
    const features = [
        { icon: Rocket, title: "Career Growth", desc: "Access to job fairs, internships, and networking events." },
        { icon: Lightbulb, title: "Skill Development", desc: "Participate in workshops, competitions, and projects." },
        { icon: Users, title: "Global Community", desc: "Connect with professionals and students worldwide." }
    ];
    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full">
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Why Join Us?</h2>
            </div>
            <div className="space-y-5">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 dark:from-emerald-500 dark:to-green-600 rounded-lg flex items-center justify-center shadow-md">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default WhyJoinIEEE;