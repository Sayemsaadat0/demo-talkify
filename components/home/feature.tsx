"use client";
import { FEATURE_BG, FEATURE_BG_DESKTOP, FEATURES } from "@/lib/constant";
import Image from "next/image";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface Feature {
  id: number;
  icon: string;
  heading: string;
  description: string;
  bgImage: string;
  hoverImage: string;
  hoverIcon: string;
}

const Feature = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(2); // Default active card is 2nd card

  const getCardBackground = (feature: Feature) => {
    if (hoveredCard === feature.id) {
      return feature.hoverImage;
    }
    return feature.bgImage;
  };

  const getCardIcon = (feature: Feature) => {
    if (hoveredCard === feature.id) {
      return feature.hoverIcon;
    }
    return feature.icon;
  };

  return (
    <section className="bg-cover bg-top w-full h-full bg-no-repeat py-10 my-8 px-4 relative">
      {/* Mobile Background */}
      <div
        style={{ backgroundImage: `url(${FEATURE_BG})` }}
        className="absolute inset-0 bg-cover bg-top bg-no-repeat md:hidden"
      ></div>

      {/* Desktop Background */}
      <div
        style={{ backgroundImage: `url(${FEATURE_BG_DESKTOP})` }}
        className="absolute inset-0 bg-cover bg-top bg-no-repeat hidden md:block"
      ></div>

      <div className="relative z-10 pt-14 pb-8 md:pt-36 md:pb-20 ">
        <div className="   ">
          <div className="flex flex-col items-center gap-2 justify-center text-white max-w-xs md:max-w-3xl mx-auto text-center">
            <h1 className="text-2xl md:text-6xl font-bold ">
              Everything you need for customer engagement
            </h1>
            <p className="text-sm md:text-lg md:my-6 my-2">
              Our platform brings together all the tools you need to deliver
              exceptional customer experience across every touchpoint.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white mt-4 container mx-auto">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              style={{ backgroundImage: `url(${getCardBackground(feature)})` }}
              className="bg-cover bg-no-repeat p-4 rounded-2xl flex flex-col gap-2 transition-all duration-300 ease-in-out cursor-pointer"
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(2)} // Return to default active card (2nd card)
            >
              <Image
                src={getCardIcon(feature)}
                alt={feature.heading}
                width={50}
                height={50}
                className="transition-all duration-300 ease-in-out"
              />
              <h2 className="text-lg md:text-2xl md:mt-4 font-bold">{feature.heading}</h2>
              <p className="text-sm md:text-lg">{feature.description}</p>
              <div className="flex items-center gap-2 text-xs md:text-lg mt-2 text-[#3CDDFF]">
                Learn More <FaArrowRight color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Feature;
