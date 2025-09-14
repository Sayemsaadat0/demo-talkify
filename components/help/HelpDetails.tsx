"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { HELP_ARTICLE_API } from "@/api/api";

interface Article {
  id: number;
  category_id: number;
  user_id: number;
  title: string;
  description: string;
  featured: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ArticleResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Article[];
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

const HelpDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<ArticleResponse["data"] | null>(
    null
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    setLoading(true);
    fetch(`${HELP_ARTICLE_API}/${slug}?page=${page}`)
      .then((res) => res.json())
      .then((data: ArticleResponse) => {
        setArticles(data.data.data);
        setPagination(data.data);
      })
      .finally(() => setLoading(false));
  }, [slug, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.replace(`?page=${newPage}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-0 py-12">
      <Link
        href="/help"
        className="text-sm text-gray-500 hover:underline mb-6 inline-block"
      >
        &larr; Choose another article
      </Link>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="w-full max-w-2xl ">
          {/* Accordion */}
          {articles.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No articles found.
            </div>
          ) : (
            <div className="grid gap-4">
              {articles.map((article, idx) => (
                <button
                  key={article.id}
                  className="w-full text-left px-6 py-5 border border-blue-100 rounded-xl bg-white hover:bg-blue-50 transition-colors font-semibold text-lg md:text-xl shadow-sm focus:outline-none"
                  onClick={() => setModalIdx(idx)}
                  aria-label={`Show details for ${article.title}`}
                >
                  {article.title}
                </button>
              ))}
              {/* Modal */}
              {modalIdx !== null && articles[modalIdx] && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40"
                  onClick={() => setModalIdx(null)}
                >
                  <div
                    className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-lg animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                      onClick={() => setModalIdx(null)}
                      aria-label="Close details"
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-blue-700">
                      {articles[modalIdx].title}
                    </h2>
                    <div
                      className="prose max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{
                        __html: articles[modalIdx].description,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Pagination */}
          {pagination && (
            <div className="flex  mt-10 gap-2 flex-wrap">
              {pagination.links.map((link, idx) => {
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
      )}
    </div>
  );
};

export default HelpDetails;
