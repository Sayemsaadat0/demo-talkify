import HeroSection from "@/components/home/hero-section";
import Feature from "@/components/home/feature";
import Engagement from "@/components/home/engagement";
import Map from "@/components/home/map";
import Testimonial from "@/components/home/testimonial";
import Benifits from "@/components/home/benifits";
import Price from "@/components/home/price";
import FAQ from "@/components/home/faq";

const HomePage = () => {
  return (
    <>
      <div className="bg-white">
        <HeroSection />
      </div>
      <Feature />
      <Engagement />
      <Testimonial />
      <Benifits />
      <Price />
      <FAQ />
      <Map />
    </>
  );
};
export default HomePage;
