'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Users, ExternalLink, Star } from 'lucide-react';

import eventData from '@/data/eventData.json';
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
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const event = useMemo(
    () => (id ? eventData.find((e) => e.id.toString() === id) || null : null),
    [id]
  );

  const eventDate = event ? new Date(`${event.date}T00:00:00`) : null;
  const now = new Date();
  const isPastEvent = eventDate ? eventDate < now : false;

  useEffect(() => {
    setLoading(false);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(`${dateStr}T00:00:00`);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (!event) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.eventName,
          text: `Join us for ${event.eventName}`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      } else {
        alert('Sharing not supported. Please copy the URL manually.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      alert('Failed to share the event.');
    }
  };

  const eventHighlights = useMemo(
    () => [
      { icon: User, text: 'Expert Speaker' },
      { icon: Users, text: 'Q&A Session' },
      { icon: Star, text: 'Networking' },
      { icon: ExternalLink, text: 'Interactive Content' },
    ],
    []
  );

  if (loading) return <LoadingState />;

  if (!id || !event) {
    return (
      <main className="text-center py-20 text-gray-700 dark:text-gray-300">
        <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
        <p>Please check the link or try searching for other events.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-500">
      <HeroSection event={event} isPastEvent={isPastEvent} formatDate={formatDate} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          <aside className="space-y-6" aria-label="Event information">
            <EventInfoCard
              event={event}
              formatDate={formatDate}
              isPastEvent={isPastEvent}
              handleShare={handleShare}
            />
          </aside>
        </div>
      </section>

      <Modal ref={modalRef} photos={event.gallery || []} />
    </main>
  );
};

export default EventDetails;
