'use client';

import { Calendar, MapPin, Users, User, Share2 } from 'lucide-react';
import registeredData from  "@/data/registered.json"; 

const EventInfoCard = ({ event, formatDate, isPastEvent, handleShare, isSharing }) => {
  const totalRegistered = registeredData.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-green-800 sticky top-20 transition-colors duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Event Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Date & Time</p>
            <p className="text-gray-600 dark:text-gray-300">{formatDate(event.date)}</p>
            <p className="text-gray-600 dark:text-gray-300">{event.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Location</p>
            <p className="text-gray-600 dark:text-gray-300">{event.eventArea}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {isPastEvent ? 'Participants' : 'Currently Registered Participants'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {isPastEvent ? `${event.participant} attendees` : `${50+totalRegistered} registered`}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Organizer</p>
            <p className="text-gray-600 dark:text-gray-300">{event.organizer}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        {!isPastEvent ? (
          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
            Register Now
          </button>
        ) : (
          <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-300 py-3 px-4 rounded-lg font-medium text-center">
            Event Completed
          </div>
        )}

        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full border-2 border-green-600 text-green-600 dark:border-green-500 dark:text-green-400 py-3 px-4 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? 'Sharing...' : 'Share Event'}
        </button>
      </div>
    </div>
  );
};

export default EventInfoCard;
