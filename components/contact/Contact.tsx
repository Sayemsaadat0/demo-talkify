import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";
// import ContactForm from "./ContactForm";
import ContactMap from "./ContactMap";

interface ContactProps {
  contactData: {
    pageSeo: {
      page_title: string;
      meta_title: string;
      meta_keywords: string;
      meta_description: string;
      og_description: string;
      meta_robots: string;
      meta_image: string;
      breadcrumb_image: string | null;
    };
    content: {
      id: number;
      content_id: number;
      language_id: number;
      description: {
        phone: string;
        email: string;
        address: string;
        heading: string;
        drop_line_message: string;
        form_heading: string;
        form_title: string;
      };
      created_at: string;
      updated_at: string;
    };
  };
}

const Contact = ({ contactData }: ContactProps) => {
  return (
    <>
      <ContactCard contactData={contactData} />
      <ContactForm contactData={contactData} />
      <ContactMap  />
    </>
  );
};

export default Contact;
