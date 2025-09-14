import HelpDetails from "@/components/help/HelpDetails";
import Breadcrumb from "@/components/shared/breadcrumb";

const HelpDetailsPage = async () => {
  return (
    <>
      <Breadcrumb title="Help Details" breadcrumb="Help Details" />
      <HelpDetails />
    </>
  );
};

export default HelpDetailsPage;