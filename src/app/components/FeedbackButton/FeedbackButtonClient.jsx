"use client";

import dynamic from "next/dynamic";

const FeedbackButton = dynamic(() => import("./page.jsx"), { ssr: false });

const FeedbackButtonClient = () => <FeedbackButton />;

export default FeedbackButtonClient;
