import About from "./About/page";
import HeroSection from "./HeroSection/page";
import AllEvent from "./events/page";
import ModeratorMessages from "./ModeratorMessages/page"
import Feature from "./Feature/page";
import AllPhoto from "./Gallery/page";
import FAQ from "./FAQ/page";

function Page() {
    return (
        <main>
            <HeroSection />
            <About />
            <ModeratorMessages />
            <AllEvent />
            <AllPhoto />
            <Feature />
            <FAQ />
        </main>
    )
}

export default Page
