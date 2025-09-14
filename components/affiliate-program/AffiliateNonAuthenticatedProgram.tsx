"use client";

import { AFFILIATE, AFFILIATE_FAQS, AFFILIATE_STEPS } from "@/lib/constant";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiAward,
} from "react-icons/fi";

const faqIcons = [
  <FiFileText key={1} className="w-6 h-6 text-blue-600" />,
  <FiUsers key={2} className="w-6 h-6 text-blue-600" />,
  <FiAward key={3} className="w-6 h-6 text-blue-600" />,
  <FiBarChart2 key={4} className="w-6 h-6 text-blue-600" />,
];

const AffiliateNonAuthenticatedProgram = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Flexible pricing for every need!
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Choose the perfect plan for your needs—no hidden fees, just powerful
            AI at your fingertips!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image and Stats */}
          <div className="relative">
            <Image
              src={AFFILIATE}
              alt="Affiliate Program"
              width={600}
              height={400}
              className="rounded-2xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-12 left-0 right-0 bg-blue-600 text-white p-6 rounded-2xl flex justify-around items-center w-[80%] mx-auto">
              <div>
              <p className="text-3xl font-bold">600+</p>
                <p className="text-sm font-semibold opacity-80">
                  SUCCESSFUL PROJECTS
                </p>
              </div>
              <div className="h-12 w-px bg-white/30 hidden md:block"></div>
              <div>
              <p className="text-3xl font-bold">384</p>
                <p className="text-sm font-semibold opacity-80">
                  GLOBAL DOWNLOADS
                </p>
              </div>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="space-y-4 mt-12 lg:mt-0">
            {AFFILIATE_FAQS.map((faq, index) => (
              <div
                key={faq.id}
                className={`rounded-xl transition-all duration-300 ${
                  openFaq === faq.id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-start text-left p-6 space-x-6"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      openFaq === faq.id
                        ? "bg-white/10"
                        : "bg-blue-50 border border-blue-100"
                    }`}
                  >
                    {faqIcons[index]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{faq.question}</h3>
                    <AnimatePresence>
                      {openFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <p className="text-sm opacity-90 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    {openFaq === faq.id ? (
                      <FiChevronUp className="w-6 h-6" />
                    ) : (
                      <FiChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center my-20 md:pt-20">
          <h2 className="text-4xl font-bold text-gray-900">
            Join the program in four easy steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {AFFILIATE_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`relative p-8 rounded-xl border transition-all duration-300 ${
                index === 1
                  ? "bg-blue-600 text-white border-transparent"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <p
                className={`text-5xl font-bold mb-4 ${
                  index === 1 ? "text-white/30" : "text-blue-200"
                }`}
              >
                0{step.id}
              </p>
              <h3
                className={`text-xl font-bold mb-3 ${
                  index === 1 ? "text-white" : "text-gray-800"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  index === 1 ? "text-white/80" : "text-gray-600"
                }`}
              >
                {step.description}
              </p>
              <div
                className={`absolute  left-1/2 -bottom-3 transform -translate-x-1/2 w-6 h-6 border-b-2 border-r-2 rotate-45 ${
                  index === 1
                    ? "bg-blue-600 border-transparent"
                    : "bg-blue-50 border-blue-200"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliateNonAuthenticatedProgram;
