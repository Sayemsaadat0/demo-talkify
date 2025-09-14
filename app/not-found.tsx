"use client";
import Link from "next/link";
import Image from "next/image";
import { LOGO_URL } from "@/lib/constant";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#23272F] px-4">
      <div className="relative flex flex-col items-center">
        {/* Animated 404 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[6rem] md:text-[8rem] font-extrabold animate-bounce text-blue-500">
            4
          </span>
          <div className="w-24 h-24 md:w-32 md:h-32 animate-float flex items-center justify-center">
            {/* Logo inside white circle */}
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg">
              <Image
                src={LOGO_URL}
                alt="logo"
                width={72}
                height={72}
                className="object-contain w-16 h-16 md:w-24 md:h-24"
              />
            </div>
          </div>
          <span className="text-[6rem] md:text-[8rem] font-extrabold animate-bounce text-blue-500">
            4
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg md:text-xl text-gray-500 mb-8 text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          Go Home
        </Link>
      </div>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
