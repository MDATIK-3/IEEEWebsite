"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Contributors from "./Contributors";

const Footer = () => {
  const customLinks = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/Gallery" },
    { label: "Events", href: "/Events" },
    { label: "Executives", href: "/Executives" },
  ];

  const websiteLinks = [
    { label: "Green University", href: "https://green.edu.bd/" },
    { label: "Join IEEE", href: "https://www.ieee.org/" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Image
                src="/images/IEEE_SB.png"
                alt="IEEE Logo"
                width={160}
                height={70}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 text-base sm:text-sm leading-relaxed">
              IEEE Student Branch GUB - Empowering technology leaders through
              innovation, collaboration, and professional development in Green
              University of Bangladesh.
            </p>
            <div className="flex justify-center md:justify-start flex-wrap gap-3">
              <a
                href="https://www.facebook.com/ieeesbgub/"
                className="text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center md:justify-start">
              <BookOpen className="h-5 w-5 mr-2" />
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center gap-3 md:flex-col md:items-start md:gap-2 text-base sm:text-sm text-gray-700">
              {customLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="transition-all duration-200 hover:text-green-600 hover:underline underline-offset-4 hover:scale-[1.03]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 flex justify-center md:justify-start items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start justify-center md:justify-start space-x-3 group cursor-pointer">
                <MapPin className="hidden md:block h-5 w-5 mt-0.5 text-gray-500 group-hover:text-green-600 transition-colors" />
                <p className="text-gray-600 text-base sm:text-sm group-hover:text-green-600 transition-colors">
                  Green University of Bangladesh
                  <br />
                  Purbachal American City, Kanchan
                  <br />
                  Rupganj, Narayanganj-1461, Dhaka
                </p>
              </div>
              <a
                href="mailto:ieee_sb@green.edu.bd"
                className="flex items-center justify-center md:justify-start space-x-3 group hover:scale-105 transition-transform duration-300"
              >
                <Mail className="h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors" />
                <span className="text-gray-600 hover:text-green-600 hover:underline underline-offset-4 transition-all duration-300 text-base sm:text-sm">
                  ieee_sb@green.edu.bd
                </span>
              </a>
              <a
                href="tel:+8809614482482"
                className="flex items-center justify-center md:justify-start space-x-3 group hover:scale-105 transition-transform duration-300"
              >
                <Phone className="h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors" />
                <span className="text-gray-600 hover:text-green-600 hover:underline underline-offset-4 transition-all duration-300 text-base sm:text-sm">
                  +880 9614482482
                </span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex justify-center md:justify-start items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Main Website
            </h3>
            <div className="space-y-2 text-base sm:text-sm">
              {websiteLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center justify-center md:justify-start space-x-2 hover:text-transparent hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:bg-clip-text transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <Contributors />
      </div>
    </footer>
  );
};

export default Footer;
