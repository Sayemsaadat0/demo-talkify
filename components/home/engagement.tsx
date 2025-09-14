import { ENGAGEMENT } from "@/lib/constant";
import Image from "next/image";

const Engagement = () => {
  return (
    <section className="bg-cover bg-top w-full h-full bg-no-repeat py-10 my-8 px-4">
      <div>
        <div className="flex flex-col items-center gap-2 justify-center max-w-xs md:max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-6xl font-bold">
            We offer AI chatbot servicesfor any industry{" "}
          </h1>
          <p className="text-sm md:text-lg text-[#545C66] md:my-6 my-2 tracking-wider md:leading-relaxed">
            Our platform brings together all the tools you need to deliver
            exceptional customer experience across every touchpoint.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4 container mx-auto">
        {/* First Card - Full Width */}
        <div
          key={ENGAGEMENT[0].id}
          style={{ backgroundImage: `url(${ENGAGEMENT[0].bgImage})` }}
          className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col gap-4 text-white md:flex-row justify-between items-center min-h-[300px] md:min-h-[250px]"
        >
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#3CDDFF] mb-4">
              {ENGAGEMENT[0].heading}
            </h2>
            <p className="text-sm text-[#BDBDBD] max-w-md">
              {ENGAGEMENT[0].description}
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={ENGAGEMENT[0].image}
              alt={ENGAGEMENT[0].heading}
              width={400}
              height={200}
              className="w-full md:w-auto md:max-w-md h-auto object-cover mt-4 md:mt-0"
            />
          </div>
        </div>

        {/* Second Row - Large Left, Small Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large Card (Left) - spans 2 columns */}
          <div
            key={ENGAGEMENT[1].id}
            style={{ backgroundImage: `url(${ENGAGEMENT[1].bgImage})` }}
            className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col justify-between text-white md:col-span-2 min-h-[350px] md:min-h-[280px]"
          >
            <div>
              <h2 className="text-lg font-bold text-[#3CDDFF] mb-4">
                {ENGAGEMENT[1].heading}
              </h2>
              <p className="text-sm text-[#BDBDBD] mb-6">
                {ENGAGEMENT[1].description}
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src={ENGAGEMENT[1].image}
                alt={ENGAGEMENT[1].heading}
                width={300}
                height={150}
                className="w-full md:max-w-sm h-auto object-cover"
              />
            </div>
          </div>

          {/* Small Card (Right) - spans 1 column */}
          <div
            key={ENGAGEMENT[2].id}
            style={{ backgroundImage: `url(${ENGAGEMENT[2].bgImage})` }}
            className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col justify-between text-white md:col-span-1 min-h-[350px] md:min-h-[280px]"
          >
            <div>
              <h2 className="text-lg font-bold text-[#3CDDFF] mb-4">
                {ENGAGEMENT[2].heading}
              </h2>
              <p className="text-sm text-[#BDBDBD] mb-6">
                {ENGAGEMENT[2].description}
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src={ENGAGEMENT[2].image}
                alt={ENGAGEMENT[2].heading}
                width={200}
                height={120}
                className="w-full md:max-w-xs h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Third Row - Small Left, Large Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Small Card (Left) - spans 1 column */}
          <div
            key={ENGAGEMENT[3].id}
            style={{ backgroundImage: `url(${ENGAGEMENT[3].bgImage})` }}
            className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col justify-between text-white md:col-span-1 min-h-[350px] md:min-h-[280px]"
          >
            <div>
              <h2 className="text-lg font-bold text-[#3CDDFF] mb-4">
                {ENGAGEMENT[3].heading}
              </h2>
              <p className="text-sm text-[#BDBDBD] mb-6">
                {ENGAGEMENT[3].description}
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src={ENGAGEMENT[3].image}
                alt={ENGAGEMENT[3].heading}
                width={200}
                height={120}
                className="w-full md:max-w-xs h-auto object-cover"
              />
            </div>
          </div>

          {/* Large Card (Right) - spans 2 columns */}
          {ENGAGEMENT[4] && (
            <div
              key={ENGAGEMENT[4].id}
              style={{ backgroundImage: `url(${ENGAGEMENT[4].bgImage})` }}
              className="bg-cover bg-center bg-no-repeat p-6 rounded-2xl flex flex-col justify-between text-white md:col-span-2 min-h-[350px] md:min-h-[280px]"
            >
              <div>
                <h2 className="text-lg font-bold text-[#3CDDFF] mb-4">
                  {ENGAGEMENT[4].heading}
                </h2>
                <p className="text-sm text-[#BDBDBD] mb-6">
                  {ENGAGEMENT[4].description}
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src={ENGAGEMENT[4].image}
                  alt={ENGAGEMENT[4].heading}
                  width={300}
                  height={150}
                  className="w-full md:max-w-sm h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Engagement;
