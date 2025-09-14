import { BREADCRUMB_BG, BREADCRUMB_BG_DESKTOP } from "@/lib/constant";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface BreadcrumbProps {
  title: string;
  breadcrumb: string;
}

const Breadcrumb = ({ title, breadcrumb }: BreadcrumbProps) => {
  return (
    <section className="bg-cover bg-center w-full h-72 bg-no-repeat  px-4 relative">
      <div
        style={{ backgroundImage: `url(${BREADCRUMB_BG})` }}
        className="absolute inset-0 bg-cover bg-top  bg-no-repeat md:hidden"
      ></div>
      <div
        style={{ backgroundImage: `url(${BREADCRUMB_BG_DESKTOP})` }}
        className="absolute inset-0 bg-cover bg-top bg-no-repeat hidden md:block"
      ></div>
      <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-black">
        <h1 className=" md:text-5xl text-3xl font-bold">{title}</h1>
        <p className="text-sm text-black flex items-center gap-1 static z-10">
          <Link href="/">Home</Link>
          <MdOutlineKeyboardArrowRight />
          <span className="text-blue-700 font-bold">{breadcrumb}</span>
        </p>
      </div>
    </section>
  );
};
export default Breadcrumb;
