import { Linkedin, Github, Facebook, Mail, MapPin, Phone } from "lucide-react";

function PersonalDetails() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500 shadow-lg mb-4">
          <img
            src="/images/profile.jpeg"
            alt="Profile Photo"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Md Atik Hasan
        </h2>
        <p className="text-cyan-600 font-medium">Full Stack Developer</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Contact Information
      </h3>

      <div className="space-y-6">
        <div className="flex items-start group">
          <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500 group-hover:text-cyan-600 group-hover:bg-cyan-100 transition-colors duration-300 mr-4">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Location</h3>
            <p className="text-gray-600 mt-1">
              Narayanganj Sadar, Dhaka, Bangladesh
            </p>
          </div>
        </div>

        <div className="flex items-start group">
          <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500 group-hover:text-cyan-600 group-hover:bg-cyan-100 transition-colors duration-300 mr-4">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <a
              href="mailto:atikh335@gmail.com"
              className="text-gray-600 hover:text-cyan-600 transition mt-1 inline-block"
            >
              atikh335@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start group">
          <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500 group-hover:text-cyan-600 group-hover:bg-cyan-100 transition-colors duration-300 mr-4">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Phone</h3>
            <a
              href="tel:8801840069805"
              className="text-gray-600 hover:text-cyan-600 transition mt-1 inline-block"
            >
              +880 184006 9805
            </a>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Connect With Me
      </h3>

      <div className="flex space-x-4">
        <a
          href="https://www.linkedin.com/in/md-atik-hasan-035686332"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white p-3 rounded-full hover:shadow-lg hover:brightness-110 transition-all duration-300"
          aria-label="LinkedIn Profile"
        >
          <Linkedin size={20} />
        </a>

        <a
          href="https://github.com/MDATIK-3"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-full hover:shadow-lg hover:brightness-110 transition-all duration-300"
          aria-label="GitHub Profile"
        >
          <Github size={20} />
        </a>

        <a
          href="https://www.facebook.com/mdatikhasan.096/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full hover:shadow-lg hover:brightness-110 transition-all duration-300"
          aria-label="Facebook Profile"
        >
          <Facebook size={20} />
        </a>
      </div>

      <div className="mt-8 bg-cyan-50 p-4 rounded-lg border border-cyan-100">
        <h4 className="font-medium text-cyan-800 mb-2">
          Available for Projects
        </h4>
        <p className="text-cyan-700 text-sm">
          Currently open to freelance opportunities and collaborations. Let's
          build something amazing together!
        </p>
      </div>
    </div>
  );
}

export default PersonalDetails;