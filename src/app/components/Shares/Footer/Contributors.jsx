import Link from 'next/link';

function Contributors() {

  const currentYear = new Date().getFullYear();
  return (
    <div className="border-t border-gray-200 dark:border-slate-800 p-2 mt-6">
      <div className="text-center space-y-1 md:space-y-0">
        <div className="md:flex md:items-center md:justify-center gap-1 md:flex-wrap lg:flex-nowrap">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 md:whitespace-nowrap">
            © {currentYear} Green University IEEE Student Branch. All rights reserved. Developed by
          </p>

          <div className="text-center hover:underline ">
            <Link href="/contact/developer" className="font-bold text-green-600 inline-flex items-center">
              IEEE GUB Development Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contributors;
