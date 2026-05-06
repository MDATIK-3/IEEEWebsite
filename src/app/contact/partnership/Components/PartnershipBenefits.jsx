import { Award, Rocket, Target, Users } from "lucide-react"

const Benifits = [
    {
        icon: Users,
        title: '3000+ Active Members',
        description: 'Connect with a vibrant community of passionate engineering students',
    },
    {
        icon: Rocket,
        title: 'Innovation Focus',
        description: 'Partner with cutting-edge projects in AI, IoT, and sustainable technology',
    },
    {
        icon: Target,
        title: 'Talent Pipeline',
        description: 'Access to skilled graduates and potential future employees',
    },
    {
        icon: Award,
        title: 'Brand Visibility',
        description: 'Gain exposure through events, workshops, and digital platforms',
    },
]

function Main() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Why Partner With Us?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover the unique advantages of collaborating with our dynamic community
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Benifits.map((benefit, index) => (
                        <div
                            key={index}
                            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.2), transparent 50%)' }}></div>
                            <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                                <benefit.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="relative text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="relative text-gray-600 dark:text-gray-300">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Main