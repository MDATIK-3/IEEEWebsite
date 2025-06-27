import About from "@/app/components/HomePage/About/page";
import Banner from "@/app/components/HomePage/Banner/page";
import AllEvent from "@/app/components/HomePage/events/page";
import ModeratorMessages from "@/app/components/HomePage/ModeratorMessages/page"
import Feature from "@/app/components/HomePage/Feature/page";
import AllPhoto from "@/app/components/HomePage/Gallery/page";
import './globals.css'



const Home = () => {
    return (
        <>
            <Banner />
            <About />
            <ModeratorMessages />
            <Feature />
            <AllPhoto />
            <AllEvent />
        </>
    );
};

export default Home;