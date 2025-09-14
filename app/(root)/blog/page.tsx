import Map from "@/components/home/map";
import Breadcrumb from "@/components/shared/breadcrumb";
import Blogs from "@/components/blog/Blogs";

const BlogPage = () => {
  return (
    <>
      <Breadcrumb title="Blog" breadcrumb="Blog" />
      <Blogs />
      <Map />
    </>
  );
};
export default BlogPage;