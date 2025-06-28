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
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Contributors from "./Contributors";

const Footer = () => {
  const customLinks = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gel" },
    { label: "Events", href: "/eve" },
    { label: "Executives", href: "/mem" }
  ];

  const websiteLinks = [
    { label: "Green University", href: "#" },
    { label: "Join IEEE", href: "#" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Image
                src="/images/IEEE_SB.png"
                alt="IEEE Logo"
                width={160}
                height={70}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering the next generation of technology leaders through innovation, collaboration, and professional development.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex justify-center md:justify-start items-center">
              <BookOpen className="h-5 w-5 mr-2 text-gray-700" />
              Quick Links
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {customLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-center md:justify-start space-x-2 hover:text-blue-600 transition-colors duration-200"
                >
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex justify-center md:justify-start items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-700" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start justify-center md:justify-start space-x-3 group">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <p className="text-gray-600 text-sm group-hover:text-blue-600 transition-colors">
                  Green University of Bangladesh<br />
                  Purbachal American City, Kanchan<br />
                  Rupganj, Narayanganj-1461
                </p>
              </div>
              <a href="mailto:ieee_sb@green.edu.bd" className="flex items-center justify-center md:justify-start space-x-3 group">
                <Mail className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  ieee_sb@green.edu.bd
                </span>
              </a>
              <a href="tel:+880XXXXXXXXXX" className="flex items-center justify-center md:justify-start space-x-3 group">
                <Phone className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  +880 XXX XXXXXXX
                </span>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex justify-center md:justify-start items-center">
              <BookOpen className="h-5 w-5 mr-2 text-gray-700" />
              Main Website
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {websiteLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center justify-center md:justify-start space-x-2 hover:text-blue-600 transition-colors duration-200"
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
