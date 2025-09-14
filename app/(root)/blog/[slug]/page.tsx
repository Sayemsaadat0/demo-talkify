/* eslint-disable @typescript-eslint/no-unused-vars */
import BlogDetails from "@/components/blog/BlogDetails";
import Map from "@/components/home/map";
import Breadcrumb from "@/components/shared/breadcrumb";
import { BLOGS } from "@/lib/constant";

const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  // console.log(slug);
  // const blog = BLOGS.find((blog) => blog.id === Number(slug));
  // console.log(blog);
  return (
    <>
      <Breadcrumb title="Blog Details" breadcrumb="Blog Details" />
      <BlogDetails />
      <Map />
    </>
  );
};
export default BlogDetailsPage;