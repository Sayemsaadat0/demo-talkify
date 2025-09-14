import { BENEFITS, BENEFIT_BG, BENEFIT_BG_DESKTOP } from "@/lib/constant";
import Image from "next/image";

const Benifits = () => {
  return (
    // The parent section needs to be relative to contain the absolute backgrounds
    <section className="py-16 my-8 px-4 relative">
      {/* Mobile Background - NO parallax effect */}
      <div
        style={{ backgroundImage: `url(${BENEFIT_BG})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
      ></div>

      {/* Desktop Background - WITH parallax effect */}
      <div
        style={{ backgroundImage: `url(${BENEFIT_BG_DESKTOP})` }}
        // THE ONLY CHANGE IS HERE: We add "bg-fixed" to the desktop div's className
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block bg-fixed"
      ></div>

      {/* Content needs to be relative with a z-index to appear on top of the backgrounds */}
      <div className="relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6 justify-center text-white max-w-xs md:max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-6xl font-bold">
              Who can benefit?{" "}
            </h1>
            <p className="text-sm md:text-lg leading-relaxed md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
              Our platform brings together all the tools you need to deliver
              exceptional customer experience across every touchpoint.
            </p>
          </div>
        </div>

        {/* Mobile: Single column grid (No changes needed here) */}
        <div className="md:hidden grid grid-cols-1 gap-4 text-white mt-8 container mx-auto">
          {BENEFITS.map((feature) => (
            <div
              key={feature.id}
              style={{ backgroundImage: "url('images/benifit-card-bg.svg')" }}
              className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col gap-4 min-h-[300px]"
            >
              <h2 className="text-lg font-bold text-[#3CDDFF] text-center">
                {feature.heading}
              </h2>
              <p className="text-sm text-center text-gray-200">
                {feature.description}
              </p>
              <div className="flex justify-center mt-4">
                <Image
                  src={feature.image}
                  alt={feature.heading}
                  width={200}
                  height={150}
                  className="w-full max-w-xs h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Large card left, 2x2 grid right (No changes needed here) */}
        <div className="hidden md:flex gap-4 text-white mt-8 container mx-auto">
          {/* Left Side - Large Card (First Benefit) */}
          <div className="w-1/3">
            <div
              key={BENEFITS[0].id}
              style={{ backgroundImage: `url(${BENEFITS[0].bgImage})` }}
              className="bg-cover bg-bottom bg-no-repeat p-8 rounded-2xl flex flex-col justify-between h-full overflow-hidden"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#3CDDFF] mb-4">
                  {BENEFITS[0].heading}
                </h2>
                <p className="text-base text-gray-200 max-w-md mx-auto md:px-6">
                  {BENEFITS[0].description}
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <Image
                  src={BENEFITS[0].image}
                  alt={BENEFITS[0].heading}
                  width={300}
                  height={250}
                  className="w-full md:max-w-sm h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - 2x2 Grid (Remaining Benefits) */}
          <div className="w-2/3">
            <div className="grid grid-cols-2 gap-4 h-full">
              {BENEFITS.slice(1).map((feature) => (
                <div
                  key={feature.id}
                  style={{ backgroundImage: `url(${feature.bgImage})` }}
                  className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col justify-between min-h-[340px]"
                >
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-[#3CDDFF] mb-3">
                      {feature.heading}
                    </h2>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Image
                      src={feature.image}
                      alt={feature.heading}
                      width={150}
                      height={120}
                      className="w-full max-w-[200px] h-auto object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benifits;