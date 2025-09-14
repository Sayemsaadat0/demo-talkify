"use client";

// import Contact from "@/components/contact/Contact";
import Map from "@/components/home/map";
import Breadcrumb from "@/components/shared/breadcrumb";
import { CONTACT_FORM } from "@/api/api";
import { useEffect, useState } from "react";
import Contact from "@/components/contact/Contact";

interface PageSeo {
  page_title: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  og_description: string;
  meta_robots: string;
  meta_image: string;
  breadcrumb_image: string | null;
}

interface ContactContent {
  id: number;
  content_id: number;
  language_id: number;
  description: {
    phone: string;
    email: string;
    address: string;
    heading: string;
    drop_line_message: string;
    form_heading: string;
    form_title: string;
  };
  created_at: string;
  updated_at: string;
}

interface ContactApiResponse {
  status: boolean;
  message: string;
  data: {
    pageSeo: PageSeo;
    content: ContactContent;
  };
}

const ContactPage = () => {
  const [contactData, setContactData] = useState<
    ContactApiResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(CONTACT_FORM);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ContactApiResponse = await response.json();

      if (data.status) {
        setContactData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch contact data");
      }
    } catch (err) {
      console.error("Error fetching contact data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch contact data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb skeleton */}
        <div className="animate-pulse">
          <div className="h-72 bg-gray-200"></div>
        </div>

        {/* Contact cards skeleton */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-8 md:my-12 px-4 md:px-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="rounded-xl border border-blue-200 px-8 py-7 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form skeleton */}
        <div className="container mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6 px-4 md:px-8 py-10 md:py-20">
          {/* Left side skeleton */}
          <div className="mb-8 md:mb-0 md:pr-8 flex-1 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-10 h-10 bg-gray-200 rounded-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Right side form skeleton */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 md:p-10 flex-1 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-36 bg-gray-200 rounded mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Map skeleton */}
        <div className="container mx-auto rounded-xl overflow-hidden border border-blue-100 my-8 md:my-12 animate-pulse">
          <div className="w-full h-[320px] bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Error: {error || "Contact data not found"}
            </p>
            <button
              onClick={fetchContactData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title={contactData.pageSeo.page_title} breadcrumb="Contact" />
      <Contact contactData={contactData} />
      <Map />
    </>
  );
};

export default ContactPage;
