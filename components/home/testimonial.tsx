"use client";
import { TESTIMONIALS } from "@/lib/constant";
import { useState, useEffect } from "react";

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(autoSlide);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // Get 3 testimonials for current slide (sliding window)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % TESTIMONIALS.length;
      visible.push({ ...TESTIMONIALS[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      {/* Header Section */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6 justify-center max-w-xs md:max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900">
          See what our users are saying!          </h1>
          <p className="text-[#545C66] text-sm md:text-lg leading-relaxed md:my-6 my-2 tracking-wider md:leading-relaxed md:max-w-3xl mx-auto ">
            Our platform brings together all the tools you need to deliver
            exceptional customer experience across every touchpoint.
          </p>
        </div>
      </div>

      {/* Testimonial Grid - Full Width Container */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Mobile: Show current slide only */}
          <div className="md:hidden max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              {/* Stars */}
              <div className="flex justify-start mb-4">
                {renderStars(TESTIMONIALS[currentSlide].rating)}
              </div>

              {/* Testimonial Text */}
              <div className="mb-6">
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  &quot;{TESTIMONIALS[currentSlide].testimonial}&quot;
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {TESTIMONIALS[currentSlide].avatar}
                  </span>
                </div>

                {/* Name and Position */}
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {TESTIMONIALS[currentSlide].name}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    {TESTIMONIALS[currentSlide].position}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Show only 3 testimonials at a time */}
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={`${testimonial.originalIndex}-${currentSlide}`}
              className={`hidden md:block bg-white rounded-2xl shadow-lg p-6 border transition-all duration-500 ${
                index === 0
                  ? "border-gray-200 transform scale-100"
                  : "border-gray-200"
              }`}
            >
              {/* Stars */}
              <div className="flex justify-start mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <div className="mb-6">
                <p className="text-gray-700 text-sm leading-relaxed font-medium line-clamp-4">
                  &quot;{testimonial.testimonial}&quot;
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>

                {/* Name and Position */}
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide
                ? "bg-blue-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
