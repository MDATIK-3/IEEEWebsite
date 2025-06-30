'use client';
import { User, Star } from 'lucide-react';

const SpeakerSection = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>

      {/* Main Speaker */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.guest}</h3>
          <p className="text-green-600 font-medium mb-3">Main Speaker</p>
          <p className="text-gray-600 leading-relaxed">
            A leading expert in computer science and professional development with extensive experience
            in guiding graduates towards successful careers in the digital landscape.
          </p>
        </div>
      </div>

      {/* Special Guest */}
      {event.specialGuest && (
        <div className="flex flex-col sm:flex-row items-start gap-6 pt-6 border-t border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.specialGuest}</h3>
            <p className="text-emerald-600 font-medium mb-3">Special Guest</p>
            <p className="text-gray-600 leading-relaxed">
              Distinguished academic leader bringing valuable insights from the faculty perspective
              on professional skill development and career advancement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerSection;
