import AffiliateProgram from "@/components/affiliate-program/AffiliateProgram";
import FAQ from "@/components/home/faq";
import Map from "@/components/home/map";
import Breadcrumb from "@/components/shared/breadcrumb";

const AffiliatePage = () => {
  return (
    <>
      <Breadcrumb title="Affiliate Program" breadcrumb="Affiliate Program" />
      <AffiliateProgram />
      <FAQ />
      <div className="pt-10">
        <Map />
      </div>
    </>
  );
};
export default AffiliatePage;
