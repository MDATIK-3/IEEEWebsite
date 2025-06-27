import { Facebook, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  { name: 'Atikur Rahman', img: '/images/Atikur_Rahman.jpg' },
  { name: 'Md Atik', img: '/images/ATIKHASAN.png' },
  { name: 'Ashraful', img: '/images/Ashraful.png' },
  { name: 'Promod Chandra Das', img: '/images/Promod Chandra Das .jpg' },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center md:justify-start">
              <Image
                src="/images/IEEE_SB.png"
                alt="IEEE Logo"
                width={144}
                height={60}
                className="w-32 sm:w-36 lg:w-40 object-contain"
                priority
              />
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center md:text-left max-w-md mx-auto md:mx-0">
              A dynamic student-driven organization operating with the Department of
              Computer Science and Engineering (CSE) at Green University of Bangladesh.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Links</h3>
            <nav className="space-y-3">
              <a
                href="https://green.edu.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base transition-all duration-200 hover:translate-x-1 transform group"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gray-800 flex-shrink-0" />
                <span>Main Website</span>
              </a>
              <a
                href="https://www.ieee.org/membership/join/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base transition-all duration-200 hover:translate-x-1 transform group"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gray-800 flex-shrink-0" />
                <span>Join IEEE</span>
              </a>
            </nav>

            <div className="flex items-center pt-2">
              <p className="font-medium text-gray-700">Follow Us:</p>
              <div className="flex">
                <a
                  href="https://www.facebook.com/ieeesbgub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10  hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a
                  href="https://www.linkedin.com/company/ieee-gub-student-branch/?originalSubdomain=bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10  hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href="mailto:ieee_sb@green.edu.bd"
                  className="w-10 h-10  hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left lg:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-3">
              <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-700 mb-2">Address:</p>
                <div className="space-y-1">
                  <p>Green University of Bangladesh</p>
                  <p>Purbachal American City, Kanchan</p>
                  <p>Rupganj, Narayanganj-1461</p>
                </div>
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-700">
                <span className="font-medium">Email:</span>
                <a
                  href="mailto:ieee_sb@green.edu.bd"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  ieee_sb@green.edu.bd
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 lg:mt-6 pt-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              © {new Date().getFullYear()} Green University IEEE Student Branch. All rights reserved.
            </p>

            <div className="space-y-3">
              <p className="text-sm sm:text-base font-medium text-gray-700">
                Built with ❤️ by the following IEEE Members:
              </p>

              <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group relative"
                    title={member.name}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 relative rounded-full overflow-hidden border-2 border-gray-300 shadow-sm hover:border-gray-500 transition-all duration-200 hover:scale-110">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Tooltip for larger screens */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                      {member.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Names list for mobile */}
              <div className="block sm:hidden">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {teamMembers.map((member, index) => (
                    <span key={index}>
                      {member.name}
                      {index < teamMembers.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;