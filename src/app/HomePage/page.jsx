import About from "./About/page";
import Banner from "./Banner/page";
import AllEvent from "./events/page";
import ModeratorMessages from "./ModeratorMessages/page"
import Feature from "./Feature/page";
import AllPhoto from "./Gallery/page";
function Page() {
    return (
        <>
            <Banner />
            <About />
            <ModeratorMessages />
            <Feature />
            <AllPhoto />
            <AllEvent />
        </>
    )
}

export default Page
