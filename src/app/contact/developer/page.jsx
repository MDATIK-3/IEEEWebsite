import DeveloperCard from "./component/DeveloperCard";
import BgColor from "@/app/components/BgColor";
import BackgroundEffects from "./BackgroundEffects";


const Page = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundEffects />
      <div className="relative z-10 py-10">
        <DeveloperCard />
      </div>
      <BgColor />
    </div>
  );
};

export default Page;
