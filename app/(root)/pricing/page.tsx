import Price from "@/components/home/price";
import Testimonial from "@/components/home/testimonial";
import Faq from "@/components/home/faq";
import Map from "@/components/home/map";
import Breadcrumb from "@/components/shared/breadcrumb";
import Pricing from "@/components/pricing/Pricing";


const PricingPage = () => {
  return (
    <div className="space-y-10">
      <div>
        <Breadcrumb title="Our Pricing" breadcrumb="Pricing" />
        <Price />
      </div>
      <Pricing />
      <div>
        <Testimonial />
        <Faq />
      </div>
      <Map />
    </div>
  );
};
export default PricingPage;
