

const ContactMap = () => {
  return (
    <div className="container mx-auto rounded-xl overflow-hidden border border-blue-100  my-8 md:my-12">
      <iframe
        title="Contact Map"
        src="https://www.google.com/maps?q=Lemoore,+CA,+USA&output=embed"
        width="100%"
        height="320"
        className="w-full h-[320px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default ContactMap;
