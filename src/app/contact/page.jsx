import IEEEContactHeader from "./IEEEContactHeader";
import BranchInfoCards from "./BranchInfoCards";
import ContactForm from "./ContactForm";
import WhyJoinIEEE from "./WhyJoinIEEE";
import MapSection from "./MapSection";
import { ToastProvider } from "./Components/ToastProvider";

const Page = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-500">
        <IEEEContactHeader />
        
       
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-24">
          <BranchInfoCards />
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="lg:col-span-1">
              <WhyJoinIEEE />
            </div>
          </section>
          <MapSection />
        </main>
      </div>
    </ToastProvider>
  );
}

export default Page;