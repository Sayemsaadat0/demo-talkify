import { MAP, MAP_BG, MAP_BG_DESKTOP } from "@/lib/constant";
import Image from "next/image";
import Button from "../ui/button";

const Map = () => {
  return (
    <div className=" mx-auto pb-12 px-4 bg-white">
      <section className="relative rounded-2xl overflow-hidden border border-gray-200 container mx-auto py-12">
        {/* Mobile Background */}
        <div
          style={{ backgroundImage: `url(${MAP_BG})` }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        />

        {/* Desktop Background */}
        <div
          style={{ backgroundImage: `url(${MAP_BG_DESKTOP})` }}
          className="absolute inset-0 bg-cover bg-left bg-no-repeat hidden md:block"
        />

        <div className="relative z-10 p-8 text-white md:h-96 md:flex md:items-center">
          {/* Mobile Layout */}
          <div className="md:hidden ">
            <h1 className="text-left text-2xl md:text-6xl font-bold">
              Get Started With The Talkify Today!
            </h1>
            <p className="text-left text-sm md:text-lg mt-4 leading-relaxed md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
              Unlock seamless automation, instant support, and smarter
              conversations—all in one AI-powered assistant.
            </p>
            <Button variant="secondary" className="mt-6">
              Try 30-Days Free Trial
            </Button>
            <div className="flex items-center justify-center mt-12">
              <Image
                src={MAP}
                alt="map"
                width={1000}
                height={1000}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block md:w-full ">
            <div className="grid grid-cols-2 gap-16 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Get Started With The
                  <br />
                  Talkify Today!
                </h1>
                <p className="text-lg md:text-lg leading-relaxed opacity-90 md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
                  Unlock seamless automation, instant support, and smarter
                  conversations—all in one AI-powered assistant.
                </p>
                <Button variant="secondary" className="mt-6">
                  Try 30-Days Free Trial
                </Button>
              </div>

              {/* Right Side - Map */}
              <div className="flex items-center justify-center ">
                <Image
                  src={MAP}
                  alt="map"
                  width={800}
                  height={500}
                  className="w-full h-auto max-h-80 "
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Map;
