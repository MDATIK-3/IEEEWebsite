import DeveloperCard from "./component/DeveloperCard";
import BgColor from "../components/BgColor";
import ThreeBackground from "../components/Shares/ThreeBackground";

const Page = () => {
  return (
    <div className="relative min-h-screen">
      <ThreeBackground />
      <div className="relative z-10 py-10">
        <DeveloperCard />
        <BgColor />
      </div>
    </div>
  );
};

export default Page;