import BgColor from "../components/BgColor";
import DeveloperCard from "./component/DeveloperCard";


const page = () => {
    return (
        <div className="py-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-500">
            <DeveloperCard/>
            <BgColor/>
            
        </div>
    );
};

export default page;