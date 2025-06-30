'use client';

import { useRef, useState, useEffect } from 'react';
import { User, Users, ExternalLink, Star, X } from 'lucide-react';
import { useEvent } from '@/app/context/EventContext';

import HeroSection from './components/HeroSection';
import EventImage from './components/EventImage';
import EventDescription from './components/EventDescription';
import SpeakerSection from './components/SpeakerSection';
import EventHighlights from './components/EventHighlights';
import GallerySection from './components/GallerySection';
import EventInfoCard from './components/EventInfoCard';
import Modal from '@/app/components/Shares/Modal';
import LoadingState from '@/app/components/LoadingSpinner';

const EventDetails = () => {
  const { events, selectedEvent, loading, error } = useEvent();
  const [id, setId] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    if (parts.length > 2) setId(parts[2]);
  }, []);

  const event =
    selectedEvent || (events && id ? events.find(e => e.id.toString() === id) : null);

  const eventDate = event ? new Date(`${event.date}T00:00:00`) : null;
  const isPastEvent = eventDate ? eventDate < new Date() : false;

  const formatDate = dateStr => {
    const date = new Date(`${dateStr}T00:00:00`);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.eventName,
          text: `Join us for ${event.eventName}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const eventHighlights = [
    { icon: User, text: 'Expert Speaker' },
    { icon: Users, text: 'Q&A Session' },
    { icon: Star, text: 'Networking' },
    { icon: ExternalLink, text: 'Interactive Content' },
  ];

  if (loading || !event) {
    return (
      <LoadingState />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <HeroSection event={event} isPastEvent={isPastEvent} formatDate={formatDate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <EventImage event={event} />
            <EventDescription event={event} isPastEvent={isPastEvent} />
            <SpeakerSection event={event} />
            <EventHighlights eventHighlights={eventHighlights} />

            <GallerySection
              event={event}
              isPastEvent={isPastEvent}
              onImageClick={(index) => modalRef.current?.open(index)}
            />
          </div>

          <div className="space-y-6">
            <EventInfoCard
              event={event}
              formatDate={formatDate}
              isPastEvent={isPastEvent}
              handleShare={handleShare}
            />
          </div>
        </div>
      </div>

      <Modal ref={modalRef} photos={event.gallery || []} />
    </div>
  );
};

export default EventDetails;
