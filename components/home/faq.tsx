"use client";
import { FAQS } from "@/lib/constant";
import { useState } from "react";
import Button from "../ui/button";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // First item expanded by default

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        <div className="md:flex md:flex-row md:gap-12 md:items-start">
          {/* Left Side - Header */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="flex flex-col gap-6 text-center md:text-left">
                <h1 className="text-3xl md:text-6xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
              <p className="text-[#545C66] text-sm md:text-lg leading-relaxed md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
                Talkify is a cutting-edge communication platform designed to
                streamline conversations for individuals and businesses. It
                offers a range of features to enhance collaboration and
                connectivity.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button className="px-8 py-3">Get Help</Button>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="md:w-1/2">
            <div className="space-y-2">
              {FAQS.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                  >
                    <h3 className="text-sm md:text-lg font-semibold pr-4 ">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {activeIndex === index ? (
                        <svg
                          className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Answer Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 pb-6">
                      <p
                        className={`text-sm md:text-lg leading-relaxed ${
                          activeIndex === index ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
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

export default FAQ;
