"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEvent } from '@/app/context/EventContext';
import { Calendar, Clock, MapPin, Users, User, Award, Globe, ArrowLeft, Share2, Heart } from 'lucide-react';
import LoadingState from '@/app/components/LoadingSpinner';

const DetailsPage = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const { events, selectedEvent, loading, error } = useEvent();
  const [event, setEvent] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    if (parts.length > 2) {
      setId(parts[2]);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    if (selectedEvent && selectedEvent.id.toString() === id) {
      setEvent(selectedEvent);
    } else {
      const foundEvent = events.find((e) => e.id.toString() === id.toString());
      setEvent(foundEvent || null);
    }
  }, [id, selectedEvent, events]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (event) {
      if (navigator.share) {
        navigator.share({
          title: event.eventName,
          text: event.description || 'Join this amazing event!',
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  if (loading) {
    return (
     <LoadingState/>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-red-500">❌</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Events
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-green-600 hover:text-green-700"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-xl shadow-md hover:shadow-lg transition-all ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative h-80 bg-gradient-to-r from-green-400 to-emerald-500">
            <img
              src={event.image?.startsWith('/') ? event.image : `/${event.image}`}
              alt={event.eventName}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = 'none';
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
=            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-sm text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                {event.eventType || 'Event'}
              </span>
            </div>
          </div>

          <div className="p-8">
=            <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {event.eventName}
            </h1>

=            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {event.date && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Date</p>
                    <p className="text-gray-800 font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {event.time && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Time</p>
                    <p className="text-gray-800 font-semibold">{event.time}</p>
                  </div>
                </div>
              )}

              {event.eventArea && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    {event.eventArea.toLowerCase().includes('online') ? (
                      <Globe className="text-green-600" size={20} />
                    ) : (
                      <MapPin className="text-green-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Location</p>
                    <p className="text-gray-800 font-semibold">{event.eventArea}</p>
                  </div>
                </div>
              )}

              {event.participant && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Participants</p>
                    <p className="text-gray-800 font-semibold">{event.participant} attendees</p>
                  </div>
                </div>
              )}
            </div>

=            {(event.guest || event.specialGuest) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Speakers</h2>
                <div className="space-y-4">
                  {event.guest && (
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <User className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">Guest Speaker</p>
                        <p className="text-gray-800 font-semibold text-lg">{event.guest}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.specialGuest && (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <Award className="text-amber-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-amber-600 font-medium">Special Guest</p>
                        <p className="text-gray-800 font-semibold text-lg">{event.specialGuest}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Organized by</h3>
                <p className="text-green-700 font-medium text-xl">{event.organizer}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Register Now
              </button>
              <button className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold py-4 px-8 rounded-xl transition-all">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
