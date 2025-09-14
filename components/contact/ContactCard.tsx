import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

interface ContactCardProps {
  contactData: {
    content: {
      description: {
        phone: string;
        email: string;
        address: string;
      };
    };
  };
}

const ContactCard = ({ contactData }: ContactCardProps) => {
  const cards = [
    {
      icon: <FiPhone className="w-7 h-7 text-white" />,
      title: "Call us",
      details: [contactData.content.description.phone],
      highlight: false,
    },
    {
      icon: <FiMail className="w-7 h-7 text-blue-500" />,
      title: "Email us",
      details: [
        <span key="1" className="text-white">
          {contactData.content.description.email}
        </span>,
      ],
      highlight: true,
    },
    {
      icon: <FiMapPin className="w-7 h-7 text-white" />,
      title: "Our location",
      details: [contactData.content.description.address],
      highlight: false,
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-8 md:my-12 px-4 md:px-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border border-blue-200 px-8 py-7 flex flex-col items-center text-center shadow-sm transition-all duration-200 ${
            card.highlight
              ? "bg-gradient-to-b from-[#3B47FF] to-[#6A7BFF] border-none text-white scale-105 z-10"
              : "bg-blue-50 text-gray-900"
          }`}
        >
          <div
            className={`mb-4 flex items-center  justify-center w-12 h-12 rounded-full ${
              card.highlight ? "bg-white" : "bg-blue-500"
            }`}
          >
            {card.icon}
          </div>
          <h3
            className={`font-semibold text-lg mb-2 ${
              card.highlight ? "text-white" : "text-blue-900"
            }`}
          >
            {card.title}
          </h3>
          <div className="space-y-1 text-sm font-medium">
            {card.details.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactCard;
