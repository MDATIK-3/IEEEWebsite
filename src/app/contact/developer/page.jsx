import DeveloperCard from "./component/DeveloperCard";
import BgColor from "@/app/components/BgColor";
import ThreeBackground from "@/app/components/Shares/ThreeBackground";
import ThreeBackground2 from "@/app/components/Shares/Particles";


const Page = () => {
  return (
    <div className="relative min-h-screen">
      <ThreeBackground />
      <ThreeBackground2 />
      <div className="relative z-10 py-10">
        <DeveloperCard />
        <BgColor />
      </div>
    </div>
  );
};

export default Page;