import AchieveCard from "./Components/AchieveCard";
import AchieveHeader from "./Components/AchieveHeader";
import { getAchievements } from "@/lib/queries";

export const revalidate = 86400;

const page = async () => {
    const achievements = await getAchievements();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-500">
            <AchieveHeader />
            <AchieveCard achievements={achievements} />
        </div>
    );
};

export default page;
