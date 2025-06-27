<<<<<<< HEAD
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
=======
'use client';

import { Facebook, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Contributors from './Contributors';
import Image from 'next/image';
>>>>>>> 04753e315af6eb3e53d595bc6697ef2154eab443

const Footer = () => {
  const customLinks = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gel" },
    { label: "Events", href: "/eve" },
    { label: "Executives", href: "/mem" },
  ];

  const websiteLinks = [
    { label: "Green University", href: "#" },
    { label: "Join IEEE", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">

          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Image
                src="/images/IEEE_SB.png"
                alt="IEEE Logo"
                width={160}
                height={70}
                className="h-12 w-auto"
              />
              <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded-md">GUB</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering the next generation of technology leaders through innovation, collaboration, and professional development.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[
                { icon: Facebook, url: "#" },
                { icon: Twitter, url: "#" },
                { icon: Instagram, url: "#" },
                { icon: Linkedin, url: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

<<<<<<< HEAD
          {/* Quick Links */}
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
=======
          <div className="space-y-4 text-center md:text-left lg:col-span-1 md:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-3">
              <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-700 mb-2">Address:</p>
                <div className="space-y-1">
                  <p>Green University of Bangladesh</p>
                  <p>Purbachal American City, Kanchan</p>
                  <p>Rupganj, Narayanganj-1461</p>
                </div>
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-700">
                <span className="font-medium">Email:</span>
                <a
                  href="mailto:ieee_sb@green.edu.bd"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
>>>>>>> 04753e315af6eb3e53d595bc6697ef2154eab443
                >
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
<<<<<<< HEAD

          {/* Contact Info */}
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

          {/* Main Website */}
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

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-16 pt-8">
          <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left gap-4">
            <p className="text-gray-500 text-xs md:text-sm">
              © {new Date().getFullYear()} IEEE Student Branch, Green University of Bangladesh. All rights reserved.
            </p>

            {/* Team Avatars */}
            <div className="flex items-center gap-2">
              {[
                "images/Atikur_Rahman.jpg",
                "images/ATIKHASAN.png",
                "images/Ashraful.png"
              ].map((src, index) => (
                <div key={index} className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={src}
                    alt={`Contributor ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

=======
        </div>
        <Contributors />

>>>>>>> 04753e315af6eb3e53d595bc6697ef2154eab443
      </div>
    </footer>
  );
};

export default Footer;
