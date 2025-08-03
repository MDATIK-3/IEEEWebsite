import { Clock, Phone, Mail, Navigation } from "lucide-react";
import contactInfo from "@/data/contactInfo.json";

const iconMap = {
  Phone,
  Mail,
  Clock,
  Navigation,
};

function BranchInfoCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {contactInfo.map((item, index) => {
        const Icon = iconMap[item.icon];
        const isPhone = item.icon === "Phone";
        const isMail = item.icon === "Mail";
        const linkHref = isPhone
          ? `tel:${item.primary}`
          : isMail
          ? `mailto:${item.primary}`
          : null;

        return (
          <div
            key={index}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-gray-700/20 dark:to-transparent rounded-2xl pointer-events-none" />

            <div className="relative flex items-start space-x-4">
              {Icon && (
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {item.title}
                </h3>
                {linkHref ? (
                  <a
                    href={linkHref}
                    className="text-base font-medium text-gray-900 dark:text-white hover:underline"
                  >
                    {item.primary}
                  </a>
                ) : (
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {item.primary}
                  </p>
                )}
                {item.secondary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.secondary}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default BranchInfoCards;