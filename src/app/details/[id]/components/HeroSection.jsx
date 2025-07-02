'use client';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const HeroSection = ({ event, isPastEvent, formatDate }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-30 flex flex-col justify-center items-center">
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                        {isPastEvent ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Past Event
                            </>
                        ) : (
                            <>
                                <Calendar className="w-4 h-4 mr-2" />
                                Upcoming Event
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {event.eventName}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 text-lg">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            {formatDate(event.date)}
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            {event.time}
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default HeroSection;
