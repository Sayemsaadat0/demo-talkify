/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { BLOG_DETAILS_API } from "@/api/api";
import Image from "next/image";
import { LOGO_URL } from "@/lib/constant";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

interface BlogDetailsData {
  id: number;
  blog_id: number;
  language_id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  blog: {
    id: number;
    category_id: number;
    image_cdn: string;
    blog_image_driver: string;
    breadcrumb_status: boolean | null;
    breadcrumb_image: string | null;
    breadcrumb_image_driver: string | null;
    status: number;
    page_title: string | null;
    meta_title: string | null;
    meta_keywords: string[] | null;
    meta_description: string | null;
    og_description: string | null;
    meta_robots: string | null;
    meta_image: string | null;
    meta_image_driver: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface PopularContent {
  id: number;
  blog_id: number;
  language_id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  blog: {
    id: number;
    category_id: number;
    image_cdn: string;
    blog_image_driver: string;
    breadcrumb_status: boolean | null;
    breadcrumb_image: string | null;
    breadcrumb_image_driver: string | null;
    status: number;
    page_title: string | null;
    meta_title: string | null;
    meta_keywords: string[] | null;
    meta_description: string | null;
    og_description: string | null;
    meta_robots: string | null;
    meta_image: string | null;
    meta_image_driver: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  blogs_count: number;
}

interface BlogDetailsApiResponse {
  status: boolean;
  message: string;
  data: {
    pageSeo: PageSeo;
    blogDetails: BlogDetailsData;
    popularContentDetails: PopularContent[];
    categories: Category[];
  };
}

const BlogDetails = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const [blogData, setBlogData] = useState<
    BlogDetailsApiResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogDetails = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BLOG_DETAILS_API}/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogDetailsApiResponse = await response.json();

      if (data.status) {
        setBlogData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch blog details");
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch blog details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://staging.talkify.pro";
    return `${API_BASE_URL}/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <article className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-8 md:mb-12">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="mb-8">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (error || !blogData) {
    return (
      <article className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Error: {error || "Blog not found"}
            </p>
            <button
              onClick={fetchBlogDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </article>
    );
  }

  const { blogDetails, popularContentDetails } = blogData;

  return (
    <article className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12">
          <Image
            src={
              blogDetails.blog.image_cdn ||
              getImageUrl(blogDetails.blog.image_cdn || "")
            }
            alt={blogDetails.title}
            width={900}
            height={500}
            className="w-full h-96 rounded-lg object-contain object-center"
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {blogDetails.title}
          </h1>
          <div className="mt-4 text-sm text-gray-500">
            Published on {new Date(blogDetails.created_at).toLocaleDateString()}
          </div>
        </header>

        <div
          className="text-gray-700 space-y-6 text-base leading-relaxed prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blogDetails.description }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-blue-50">
            <Image src={LOGO_URL} alt="author logo" width={32} height={32} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Talkify</p>
            <p className="text-sm text-gray-500">Author</p>
          </div>
        </div>

        {/* Popular Blogs Section */}
        {popularContentDetails.length > 0 && (
          <section className="mt-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Popular Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularContentDetails.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <a href={`/blog/${post.slug}`}>
                    <Image
                      src={
                        post.blog.image_cdn ||
                        getImageUrl(post.blog.image_cdn || "")
                      }
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-auto object-cover"
                    />
                  </a>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <h3 className="text-sm font-bold text-gray-800 mb-4 h-10 line-clamp-2">
                      {post.title}
                    </h3>
                    <a
                      href={`/blog/${post.slug}`}
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      Read More +
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default BlogDetails;
