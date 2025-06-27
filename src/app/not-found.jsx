"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function UnderConstruction() {
    const [countdown, setCountdown] = useState(10);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(intervalRef.current);
                    window.location.href = "/";
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <main className="flex items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
            <div className="flex flex-col lg:flex-row items-center max-w-6xl gap-12 lg:gap-20">
                <div className="w-full lg:w-1/2">
                    <img
                        src="/images/notfound.png"
                        alt="Page under construction"
                        className="w-full max-w-md mx-auto animate-pulse"
                        loading="lazy"
                        draggable={false}
                    />
                </div>

                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        We're Working on This Page
                    </h1>

                    <p className="text-lg text-gray-700 max-w-lg mx-auto lg:mx-0">
                        This page is currently under construction. Please check back later or send us your feedback.
                    </p>

                    <p className="text-lg text-gray-700">
                        Redirecting to the homepage in{" "}
                        <span className="font-semibold text-green-600">{countdown}</span>{" "}
                        second{countdown !== 1 && "s"}...
                    </p>

                    <Link href="/"
                        className="inline-block w-full lg:w-auto font-semibold rounded-lg px-8 py-3 text-white shadow-lg
                        bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800
                        focus:outline-none focus:ring-4 focus:ring-green-400 transition"
                        aria-label="Go back to homepage now"
                    >
                        Go back to Homepage now

                    </Link>
                </div>
            </div>
        </main>
    );
}
