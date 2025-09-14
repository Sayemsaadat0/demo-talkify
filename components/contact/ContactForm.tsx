"use client";

import { SOCIAL_LINKS } from "@/lib/constant";
import { CONTACT_FORM_SUBMIT as CONTACT_FORM_SUBMIT_API } from "@/api/api";
import Image from "next/image";
import { useState } from "react";

interface ContactFormProps {
  contactData: {
    content: {
      description: {
        heading: string;
        drop_line_message: string;
        form_heading: string;
        form_title: string;
      };
    };
  };
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = ({ contactData }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(CONTACT_FORM_SUBMIT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6 px-4 md:px-8 py-10 md:py-20">
      {/* Left: Heading, description, social icons */}
      <div className="mb-8 md:mb-0 md:pr-8 flex-1">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {contactData.content.description.heading}
        </h2>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          {contactData.content.description.drop_line_message}
        </p>
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => {
            let bg = "bg-blue-600";
            if (link.label.toLowerCase() === "x") bg = "bg-black";
            else if (link.label.toLowerCase() === "linkedin") bg = "bg-sky-500";
            else if (link.label.toLowerCase() === "youtube") bg = "bg-red-600";
            // Facebook and default: blue-600
            return (
              <a
                key={link.id}
                href={link.href}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-full ${bg} hover:opacity-90 transition-all duration-150`}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="border-none"
                />
              </a>
            );
          })}
        </div>
      </div>
      {/* Right: Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-blue-200 rounded-xl p-6 md:p-10 flex-1"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {contactData.content.description.form_heading}
        </h3>
        <p className="text-gray-600 mb-6">
          {contactData.content.description.form_title}
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">
              Thank you! Your message has been sent successfully.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name*"
            required
            className="border border-blue-200 rounded-md px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email*"
            required
            className="border border-blue-200 rounded-md px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Subject*"
            required
            className="border border-blue-200 rounded-md px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <select
            required
            className="border border-blue-200 rounded-md px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-400"
          >
            <option value="">Select Service</option>
            <option value="service1">Service 1</option>
            <option value="service2">Service 2</option>
          </select>
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Type Comment here*"
          required
          className="border border-blue-200 rounded-md px-5 py-3 w-full h-36 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 mb-6 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-[#3B47FF] to-[#6A7BFF] text-white rounded-md px-8 py-3 font-semibold text-lg transition-colors ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-[#2a36c7] hover:to-[#4e5ed1]"
          }`}
        >
          {loading ? "Sending..." : "Send now"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
