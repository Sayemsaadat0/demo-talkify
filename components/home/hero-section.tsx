'use client'
import {
  DOT_ICON,
  HERO_VIDEO_URL,
  TICK_ICON,
  VECTOR_ICON,
} from "@/lib/constant";
import Button from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const handleSetEmail = (email: string) => {
    localStorage.setItem('email', email);
    router.push('/signup');
  }
  return (
    <section className="flex flex-col md:flex-row-reverse  gap-2 px-4 relative md:min-h-[65vh] md:justify-between md:items-center container mx-auto ">
      <div className="md:flex-1 md:w-1/3 ">
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover aspect-6/3 "
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-1 md:w-2/3 relative">
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold md:text-7xl">
            Connectivity & Networking with AI Power Chatbot
          </h1>
          <p className="text-[#545C66] text-sm md:text-lg  md:mt-4 tracking-wider md:leading-relaxed">
            Experience seamless communication with Talkify. Your ultimate
            platform for connecting with anyone, anytime, and anywhere. Stay
            connected effortlessly and efficiently. Welcome to the future of
            communication!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <input
            type="text"
            placeholder="✉️ Enter business email"
            className="w-full relative z-10 md:w-4/6 p-4 rounded-md border-2 border-[#3C4BFF] text-center md:text-left traking-wide"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full md:w-2/6 py-4" onClick={() => handleSetEmail(email)}>Get Started</Button>
        </div>
        <div className="flex gap-2 mt-1 text-sm md:text-lg md:mt-4  justify-center md:justify-start">
          <p className="flex items-center gap-2 text-[#6B7280]">
            <Image src={TICK_ICON} alt="tick" width={16} height={16} /> Free 1
            month trial
          </p>
          <p className="flex items-center gap-2 text-sm md:text-lg text-[#6B7280]">
            <Image src={TICK_ICON} alt="tick" width={16} height={16} /> No
            credit card required
          </p>
        </div>
        <Image
          src={VECTOR_ICON}
          alt="vector"
          width={30}
          height={30}
          className="absolute top-0 -right-20 hidden md:block scale-75 md:h-[100px] md:w-[100px]"
        />
      </div>
      <Image
        src={VECTOR_ICON}
        alt="vector"
        width={30}
        height={30}
        className="absolute -bottom-10 left-15 md:scale-125 md:h-[100px] md:w-[100px]"
      />

      <Image
        src={DOT_ICON}
        alt="dot"
        width={200}
        height={200}
        className="absolute top-10 -left-20 hidden md:block scale-200"
      />
      <Image
        src={DOT_ICON}
        alt="dot"
        width={300}
        height={300}
        className="absolute top-110 -left-20 hidden md:block scale-200"
      />
      <Image
        src={DOT_ICON}
        alt="dot"
        width={300}
        height={300}
        className="absolute top-0 -right-20 hidden md:block scale-200 rotate-180"
      />
    </section>
  );
};
export default HeroSection;
