import Stats from './Stats';
import Mission from './Mission';
import CoreValues from './CoreValues';
import Activities from './Activities';
import { Users, Calendar, Trophy, Handshake, Rocket, BookOpen, Globe } from 'lucide-react';

const stats = [
  { number: '3000+', label: 'Active Members', icon: <Users className="text-green-600" size={32} /> },
  { number: '50+', label: 'Annual Events', icon: <Calendar className="text-green-600" size={32} /> },
  { number: '10+', label: 'Years Active', icon: <Trophy className="text-green-600" size={32} /> },
];

const coreValues = [
  { icon: <Handshake className="text-green-500" size={20} />, title: 'Collaboration', desc: 'Working together for impact' },
  { icon: <Rocket className="text-green-500" size={20} />, title: 'Innovation', desc: 'Creative solutions for tomorrow' },
  { icon: <BookOpen className="text-green-500" size={20} />, title: 'Learning', desc: 'Continuous skill development' },
  { icon: <Globe className="text-green-500" size={20} />, title: 'Global Vision', desc: 'Worldwide engineering network' },
];

const activities = [
  'Workshops',
  'Tech Talks',
  'Coding Sessions',
  'Projects',
  'Mentorship',
  'Competitions',
  'Networking',
];

const About = () => {
  return (
    <section className="pt-24 pb-20 text-gray-800 overflow-hidden min-h-[600px] relative">
      <div
        className="absolute dark:text-white inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(79, 70, 229, 0.05) 1px, transparent 1.2px), 
          linear-gradient(to bottom, rgba(79, 70, 229, 0.05) 1px, transparent 1px)`,
          backgroundSize: '45px 45px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 transition-all">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Empowering Future <br />
            <span className="text-green-600 hover:text-green-700 transition-colors duration-300">Engineers</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
            IEEE Student Branch is a vibrant community of{' '}
            <strong className="text-green-600 hover:text-green-700 transition-colors duration-300">3000+ passionate members</strong> dedicated to
            innovation, learning, and professional growth in electrical and computer engineering.
          </p>

          <Stats stats={stats} />
          <Mission />
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 space-y-12">
          <CoreValues coreValues={coreValues} />
          <Activities activities={activities} />
        </aside>
      </div>
    </section>
  );
};

export default About;
