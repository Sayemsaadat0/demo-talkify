"use client";

import { PRICE_BG, PRICE_BG_DESKTOP } from "@/lib/constant";
import Image from "next/image";
import { useMemo, useState } from "react";

const pricingData = {
  professional: {
    "1-month": { price: 5000, savings: 10 },
    "6-month": { price: 27000, savings: 40 },
    "12-month": { price: 50000, savings: 50 },
  },
  enterprise: {
    "1-month": { price: 10000, savings: 10 },
    "6-month": { price: 54000, savings: 40 },
    "12-month": { price: 100000, savings: 50 },
  },
};

const durationOptions = [
  { id: "1-month", label: "1 Month", savings: 10 },
  { id: "6-month", label: "1 Month", savings: 40 },
  { id: "12-month", label: "1 Month", savings: 50 },
];

const ZigzagSeparator = () => (
  <div
    className="h-3 w-full my-6 bg-repeat-x"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg width='20' height='10' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 10 L10 0 L20 10' fill='none' stroke='rgb(229, 231, 235)' stroke-width='1'/%3e%3c/svg%3e\")",
    }}
  />
);

const Pricing = () => {
  const [activePlan, setActivePlan] = useState<"professional" | "enterprise">(
    "professional"
  );
  const [activeDuration, setActiveDuration] = useState<
    "1-month" | "6-month" | "12-month"
  >("1-month");

  const { price, savings } = useMemo(
    () => pricingData[activePlan][activeDuration],
    [activePlan, activeDuration]
  );

  return (
    <section className="relative py-16 px-4 overflow-hidden container mx-auto">
      {/* Backgrounds */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden "
        style={{ backgroundImage: `url(${PRICE_BG})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block rounded-2xl"
        style={{ backgroundImage: `url(${PRICE_BG_DESKTOP})` }}
      />

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Choose your custom <br /> Talkify plan
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-8">
          {/* Robot image for mobile */}
          <div className="lg:hidden mb-8">
            <Image
              src="/images/robot.svg"
              alt="Talkify Robot"
              width={300}
              height={300}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Left Column: Card + Button */}
          <div className="w-full lg:flex-1 lg:max-w-[800px]">
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-800 text-left">
                Plan summary
              </h2>

              <p className="text-gray-500 mt-6 text-left text-sm font-bold lg:text-base">
                Choose your Talkify plan
              </p>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <button
                  onClick={() => setActivePlan("professional")}
                  className={`p-4 rounded-lg font-semibold transition-all text-sm ${
                    activePlan === "professional"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Professional
                </button>
                <button
                  onClick={() => setActivePlan("enterprise")}
                  className={`p-4 rounded-lg font-semibold transition-all text-sm ${
                    activePlan === "enterprise"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Enterprise
                </button>
              </div>

              <p className="text-gray-500 mt-6 text-left text-sm font-bold lg:text-base">
                Calculate for
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {durationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setActiveDuration(
                        option.id as "1-month" | "6-month" | "12-month"
                      )
                    }
                    className={`text-center p-3 rounded-lg transition-all border ${
                      activeDuration === option.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    <span className="font-semibold block text-sm">
                      {option.label}
                    </span>
                    <span
                      className={`text-xs ${
                        activeDuration === option.id
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      Save {option.savings}%
                    </span>
                  </button>
                ))}
              </div>

              <ZigzagSeparator />

              <h2 className="text-2xl font-bold text-gray-800 text-left">
                Price details
              </h2>
              <div className="space-y-3 mt-4 text-gray-600 text-sm md:text-base font-semibold border-y border-dashed border-gray-300 py-4">
                <div className="flex justify-between items-center">
                  <p>Price</p>
                  <p className="font-semibold text-gray-800">BDT {price}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Savings</p>
                  <p className="font-semibold text-blue-600">{savings}%</p>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-gray-800 mt-4">
                <p>Grand Total</p>
                <p>BDT {price}</p>
              </div>
            </div>

            <button
              onClick={() => {
                // Navigate to payment page with plan ID
                const planId = activePlan === "professional" ? "1" : "2"; // Mock plan IDs
                window.location.href = `/payment?planId=${planId}`;
              }}
              className="w-full mt-4 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all text-sm shadow-2xl"
            >
              Get Subscription
            </button>

            <p className="w-full text-xs text-white/60 text-left mt-4">
              VAT is not included, it will be calculated on the checkout screen
              based on your location
            </p>
          </div>

          {/* Right Column: Robot Image for Desktop */}
          <div className="hidden lg:block">
            <Image
              src="/images/robot.svg"
              alt="Talkify Robot"
              width={450}
              height={450}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
