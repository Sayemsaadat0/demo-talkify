"use client";

import { BLOG_LIST_API } from "@/api/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface BlogDetails {
  id: number;
  blog_id: number;
  language_id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  category_id: number;
  blog_image: string;
  blog_image_driver: string;
  image_cdn: string;
  breadcrumb_status: null | boolean;
  breadcrumb_image: null | string;
  breadcrumb_image_driver: null | string;
  status: number;
  page_title: string | null;
  meta_title: string | null;
  meta_keywords: string[] | null;
  meta_description: string | null;
  og_description: string | null;
  meta_robots: string | null;
  meta_image: null | string;
  meta_image_driver: null | string;
  created_at: string;
  updated_at: string;
  category: BlogCategory;
  details: BlogDetails;
}

interface BlogApiResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: BlogPost[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BLOG_LIST_API}?page=${page}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status) {
        setBlogs(data.data.data);
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
        setTotalBlogs(data.data.total);
      } else {
        throw new Error(data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchBlogs(page);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // Assuming the API base URL for images
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://staging.talkify.pro";
    return `${API_BASE_URL}/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => fetchBlogs(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Link href={`/blog/${post.details.slug}`}>
                <Image
                  src={post.image_cdn || getImageUrl(post.image_cdn)}
                  alt={post.details.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover object-center"
                />
              </Link>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  {post.category.name} •{" "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-4 h-14 line-clamp-2">
                  {post.details.title}
                </h3>
                <Link
                  href={`/blog/${post.details.slug}`}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Read More +
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full transition-colors disabled:opacity-50 enabled:hover:bg-gray-200"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full transition-colors disabled:opacity-50 enabled:hover:bg-gray-200"
            >
              <FiChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}

        {/* Show total count */}
        {totalBlogs > 0 && (
          <div className="text-center mt-4 text-gray-600">
            Showing {blogs.length} of {totalBlogs} blogs
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
