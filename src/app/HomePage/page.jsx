import About from "./About/page";
import Banner from "./Banner/page";
import AllEvent from "./events/page";
import ModeratorMessages from "./ModeratorMessages/page"
import Feature from "./Feature/page";
import AllPhoto from "./Gallery/page";
import FAQ from "./FAQ/page";

function Page() {
    return (
        <main>
            <Banner />
            <About />
            <ModeratorMessages />
            <Feature />
            <AllPhoto />
            <AllEvent />
            <FAQ></FAQ>
        </main>
    )
}

export default Page
