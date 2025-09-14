import {
  LOGO_WHITE_URL,
  SOCIAL_LINKS,
  FOOTER_LINKS,
  APP_NAME,
} from "@/lib/constant";
import Image from "next/image";
import Button from "../ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#000F1F] text-white">
      <div className=" px-4 py-8 container mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Footer Menu Sections */}
          <div className="py-12 ">
            <div className="grid grid-cols-2 gap-0">
              {/* Left Column - Product and Developers */}
              <div className="space-y-8">
                {/* Product Section */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">
                    {FOOTER_LINKS[0].title}
                  </h3>
                  <ul className="space-y-3">
                    {FOOTER_LINKS[0].subLinks.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Developers Section */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">
                    {FOOTER_LINKS[2].title}
                  </h3>
                  <ul className="space-y-3">
                    {FOOTER_LINKS[2].subLinks.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - About */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">
                  {FOOTER_LINKS[1].title}
                </h3>
                <ul className="space-y-3">
                  {FOOTER_LINKS[1].subLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-gray-700 pt-8 pb-8">
            <div className="max-w-md">
              <h3 className="text-white font-semibold text-lg mb-4">
                Newsletter
              </h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipiscing vitae mattis
                tellus. Nullam quis mattis.
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
                  />
                </div>
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Logo and Social */}
          <div className="flex items-center justify-between border-t border-gray-700 pt-6">
            <Image
              src={LOGO_WHITE_URL}
              alt="logo"
              width={150}
              height={100}
          
            />
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => (
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={30}
                  height={40}
                  key={link.id}
                />
              ))}
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <p className="text-gray-400 text-sm text-center">
              © 2025 <span className="text-blue-400">{APP_NAME}</span>. All
              rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Top Row - Logo and Social */}
          <div className="flex items-center justify-between mb-12">
            {/* Logo */}
            <Image
              src={LOGO_WHITE_URL}
              alt="logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />

            {/* Follow us + Social Icons */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="hover:opacity-80 transition-opacity duration-200"
                  >
                    <Image
                      src={link.icon}
                      alt={link.label}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Footer Content - Menu Columns and Newsletter */}
          <div className="grid grid-cols-5 gap-8 mb-12 border-t border-gray-700 pt-12">
            {/* Footer Links Columns */}
            {FOOTER_LINKS.map((section) => (
              <div key={section.id} className="col-span-1">
                <h3 className="text-white font-semibold text-lg mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.subLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            <div className="col-span-2">
              <h3 className="text-white font-semibold text-lg mb-6">
                Newsletter
              </h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipiscing vitae mattis
                tellus. Nullam quis mattis.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-[#1A2332] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2025 <span className="text-blue-400">{APP_NAME}</span>. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
