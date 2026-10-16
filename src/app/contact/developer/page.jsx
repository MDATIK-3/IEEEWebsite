import DeveloperCard from "./component/DeveloperCard";
import BgColor from "@/app/components/BgColor";
import ThreeBackgrounds from "./component/ThreeBackgrounds";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Meet the Developers",
  description:
    "The team behind the IEEE GUB website — the developers and contributors of the IEEE Student Branch at Green University of Bangladesh.",
  path: "/contact/developer",
});


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