import Mainpage from "../HomePage/Feature/Feature"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
    title: "Collaborations & Partners",
    description:
        "Organizations, sponsors and partners collaborating with the IEEE Student Branch at Green University of Bangladesh (IEEE GUB).",
    path: "/Collaboration",
})

function page() {
    return (
        <Mainpage showAll={true} />
    )
}

export default page
