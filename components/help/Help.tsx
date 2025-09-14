/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HELP_CATEGORY_API } from "@/api/api";

interface HelpCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active_articles_count: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface HelpCategoryResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: HelpCategory[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

const Help = () => {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    HelpCategoryResponse["data"] | null
  >(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${HELP_CATEGORY_API}?page=${page}`)
      .then((res) => res.json())
      .then((data: HelpCategoryResponse) => {
        setCategories(data.data.data);
        setPagination(data.data);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto px-4 md:px-0 py-12">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search for help"
          className="flex-1 border border-gray-300 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          disabled
        />
        <button className="w-full md:w-auto bg-gradient-to-r from-[#3B47FF] to-[#6A7BFF] text-white font-semibold rounded-lg px-8 py-3 text-base opacity-60 cursor-not-allowed">
          Search
        </button>
      </div>
      {/* Help Categories Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const isActive = hovered === cat.id;
            return (
              <Link key={cat.id} href={`/help/${cat.slug}`} className="h-full">
                <div
                  className={`rounded-xl border border-blue-100 p-6 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between ${
                    isActive
                      ? "bg-[#2563eb] text-white border-none shadow-lg"
                      : "bg-blue-50 text-gray-900 hover:shadow-md"
                  }`}
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div>
                    <h3
                      className={`font-bold text-2xl mb-2 ${
                        isActive ? "text-white" : "text-blue-900"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-base mb-6 leading-relaxed">
                      {cat.description || ""}
                    </p>
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      isActive ? "text-white/80" : "text-blue-900/60"
                    }`}
                  >
                    {cat.active_articles_count} article
                    {cat.active_articles_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {pagination.links.map((link, idx) => {
            // Remove &laquo; and &raquo; for mobile, keep for desktop
            const cleanLabel = link.label
              .replace(/&laquo;|&raquo;/g, "")
              .trim();
            return (
              <button
                key={idx}
                disabled={!link.url}
                className={`px-4 py-2 rounded-md border text-base font-medium transition-colors duration-150 ${
                  link.active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (link.url) {
                    // Extract page number from url
                    const match = link.url.match(/page=(\d+)/);
                    if (match) handlePageChange(Number(match[1]));
                  }
                }}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Help;
