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
    <section
      className={`
        relative pt-24 pb-20 overflow-hidden min-h-[600px] z-0
        bg-gradient-to-br from-green-50 via-white to-green-100
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        before:content-[''] before:absolute before:inset-0 before:z-0
        before:bg-[linear-gradient(to_right,rgba(79,70,229,0.08)_1px,transparent_1.2px),linear-gradient(to_bottom,rgba(79,70,229,0.08)_1px,transparent_1px)]
        before:dark:bg-[linear-gradient(to_right,rgba(79,70,229,0.08)_1px,transparent_1.2px),linear-gradient(to_bottom,rgba(79,70,229,0.08)_1px,transparent_1px)]
        before:bg-[length:45px_45px]
      `}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 text-gray-800 dark:text-gray-300 transition-all">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight transform transition-transform duration-300 hover:scale-105 hover:text-green-700 dark:hover:text-green-500">
            Empowering Future <br />
            <span className="text-green-600 transition-colors duration-300 hover:text-green-700 dark:hover:text-green-500">
              Engineers
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed transform transition-transform duration-300 hover:scale-[1.02] hover:text-green-700 dark:hover:text-green-500">
            IEEE Student Branch is a vibrant community of{' '}
            <strong className="text-green-600 transition-colors duration-300 hover:text-green-700 dark:hover:text-green-500">
              3000+ passionate members
            </strong>{' '}
            dedicated to innovation, learning, and professional growth in electrical and computer engineering.
          </p>

          <div className="space-y-6">
            <div className="transform transition-transform duration-300 hover:scale-[1.02]">
              <Stats stats={stats} />
            </div>
            <div className="transform transition-transform duration-300 hover:scale-[1.02]">
              <Mission />
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 space-y-12">
          <div className="transform transition-transform duration-300 hover:scale-[1.03]">
            <CoreValues coreValues={coreValues} />
          </div>
          <div className="transform transition-transform duration-300 hover:scale-[1.03]">
            <Activities activities={activities} />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default About;
