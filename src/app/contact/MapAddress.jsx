'use client';
import { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Building2, Users, Award, ArrowRight, MessageCircle } from 'lucide-react';

const ContactPage = () => {
    const [activeTab, setActiveTab] = useState('location');

    const contactInfo = [
        {
            icon: Phone,
            title: "Phone",
            primary: "+880 1234 567890",
            secondary: "+880 9876 543210",
            color: "bg-blue-500"
        },
        {
            icon: Mail,
            title: "Email",
            primary: "info@greenuniversity.edu.bd",
            secondary: "admissions@greenuniversity.edu.bd",
            color: "bg-green-500"
        },
        {
            icon: Clock,
            title: "Office Hours",
            primary: "Mon - Fri: 9:00 AM - 6:00 PM",
            secondary: "Sat: 9:00 AM - 2:00 PM",
            color: "bg-purple-500"
        },
        {
            icon: MapPin,
            title: "Address",
            primary: "Green University of Bangladesh",
            secondary: "Dhaka, Bangladesh",
            color: "bg-red-500"
        }
    ];

    const campusFeatures = [
        { icon: Building2, title: "Modern Campus", desc: "State-of-the-art facilities" },
        { icon: Users, title: "Expert Faculty", desc: "Experienced professionals" },
        { icon: Award, title: "Accredited", desc: "Internationally recognized" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-all duration-500">
            
            {/* Animated Header */}
            <header className="relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 dark:from-blue-400/20 dark:to-green-400/20"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium">
                            <Navigation className="w-4 h-4 mr-2" />
                            Find Us Here
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-green-800 dark:from-white dark:via-blue-200 dark:to-green-200 bg-clip-text text-transparent">
                            Visit Our Campus
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Discover Green University of Bangladesh - where innovation meets education in the heart of Dhaka
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
                
                {/* Contact Cards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    {item.primary}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {item.secondary}
                                </p>
                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${item.color}`}></div>
                            </div>
                        );
                    })}
                </section>

                {/* Map and Info Section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    
                    {/* Enhanced Map */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Campus Location
                                </h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setActiveTab('location')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'location'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        Map View
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('directions')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'directions'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        Directions
                                    </button>
                                </div>
                            </div>
                            
                            <div className="rounded-2xl overflow-hidden shadow-inner ring-1 ring-gray-200 dark:ring-gray-600 h-96 lg:h-[500px]">
                                <iframe
                                    title="Green University Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.6933383216997!2d90.5637373751177!3d23.829501478616546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755cb0a4c65ef27%3A0xf54f56affbffdc99!2z4KaX4KeN4Kaw4KeA4KaoIOCmh-CmieCmqOCmv-CmreCmvuCmsOCnjeCmuOCmv-Cmn-CmvyDgpoXgpqwg4Kas4Ka-4KaC4Kay4Ka-4Kam4KeH4Ka2!5e0!3m2!1sbn!2sbd!4v1753871410747!5m2!1sbn!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campus Info Sidebar */}
                    <div className="space-y-6">
                        {/* Campus Features */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                                Why Visit Us?
                            </h3>
                            <div className="space-y-4">
                                {campusFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
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

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">Ready to Visit?</h3>
                            <p className="text-blue-100 mb-6 text-sm">
                                Schedule a campus tour or get in touch with our admissions team.
                            </p>
                            <div className="space-y-3">
                                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center group">
                                    <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Schedule Tour
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full bg-white text-blue-600 hover:bg-gray-50 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center group">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </button>
                            </div>
                        </div>

                        {/* Transportation Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Navigation className="w-5 h-5 mr-2 text-green-500" />
                                Getting Here
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-white">By Bus:</span> Direct routes available from major areas
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-white">By Car:</span> Parking available on campus
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-white">By Rideshare:</span> Easy pickup/drop-off points
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ContactPage;