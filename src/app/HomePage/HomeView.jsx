import About from "./About/About";
import HeroSection from "./HeroSection/HeroSection";
import AllEvent from "./events/EventsPreview";
import ModeratorMessages from "./ModeratorMessages/ModeratorMessages";
import Feature from "./Feature/Feature";
import AllPhoto from "./Gallery/GalleryPreview";
import FAQ from "./FAQ/FAQ";
import Spotlights from "./Spotlights/Spotlights";

function Page() {
    return (
        <main>
            <HeroSection />
            <About />
            <ModeratorMessages />
            <Spotlights />
            <AllEvent />
            <AllPhoto />
            <Feature />
            <FAQ />
        </main>
    )
}

export default Page
