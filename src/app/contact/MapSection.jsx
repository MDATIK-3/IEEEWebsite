import { MapPin } from "lucide-react";

const MapSection = () => (
  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
        <MapPin className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
        Our Location
      </h2>
    </div>

    <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200/40 dark:ring-gray-600/40 h-80 sm:h-96 lg:h-[500px]">
      <iframe
        title="Green University Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.6933383216997!2d90.5637373751177!3d23.829501478616546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755cb0a4c65ef27%3A0xf54f56affbffdc99!2z4KaX4KeN4Kaw4KeA4KaoIOCmh-CmieCmqOCmv-CmreCmvuCmsOCnjeCmuOCmv-Cmn-CmvyDgpoXgpqwg4Kas4Ka-4KaC4Kay4Ka-4Kam4KeH4Ka2!5e0!3m2!1sbn!2sbd!4v1753871410747!5m2!1sbn!2sbd"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full hover:brightness-105 transition duration-300"
      />
    </div>
  </div>
);

export default MapSection;
