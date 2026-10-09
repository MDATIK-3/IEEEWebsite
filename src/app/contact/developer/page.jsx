import DeveloperCard from "./component/DeveloperCard";
import BgColor from "@/app/components/BgColor";
import ThreeBackgrounds from "./component/ThreeBackgrounds";


const Page = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ThreeBackgrounds />
      <div className="relative z-10 py-10">
        <DeveloperCard />
      </div>
      <BgColor />
    </div>
  );
};

export default Page;