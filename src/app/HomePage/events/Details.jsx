import { IoMdTimer } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";

const Details = () => {
    const event = useLoaderData();
    const { image, eventName, date, guest, time, organizer, participant, eventType, eventArea, specialGuest } = event;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* Back Link */}
            <Link to="/events" className="inline-block">
                <p className="text-sm text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to events
                </p>
            </Link>

            {/* Event Header */}
            <div className="space-y-3">
                <span className="badge badge-primary text-white px-3 py-2 text-sm font-medium">{eventType}</span>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{eventName}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm md:text-base">{organizer}</span>
                </div>
            </div>

            {/* Banner Image */}
            <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                    src={image}
                    alt={eventName}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Grid Content */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Event Details</h2>

                        {guest && (
                            <div className="space-y-5">
                                <div>
                                    <p className="font-semibold text-blue-600 flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Chief Guest
                                    </p>
                                    <p className="bg-blue-50 p-4 rounded-lg text-gray-700 border border-blue-100">
                                        {guest}
                                    </p>
                                </div>

                                <div className="text-gray-600">
                                    <p className="font-semibold text-gray-600 flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Other Guests
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="font-medium text-gray-700 mb-1">Special Guest:</p>
                                        <p>{specialGuest}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Event Info</h3>

                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <CiCalendar className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium text-gray-700">{date}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                <IoMdTimer className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium text-gray-700">{time}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <IoLocationOutline className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-700">{eventArea}</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-gray-700">Participants</p>
                                <span className="text-xs text-gray-500">{participant} / 130</span>
                            </div>

                            {/* Blue Gradient Progress Bar */}
                            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(participant / 130) * 100}%`,
                                        background: "linear-gradient(to right, #3b82f6, #60a5fa)", // blue gradient
                                    }}
                                ></div>
                            </div>

                            <div className="text-right text-[11px] text-gray-500 mt-1">
                                {Math.round((participant / 130) * 100)}% filled
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">Need more information?</h4>
                        <p className="text-sm text-blue-600 mb-3">Contact the organizer for any questions about this event.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                            Contact Organizer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
