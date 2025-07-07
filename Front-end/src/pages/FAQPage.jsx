import React, { useState } from 'react';

const faqs = [
  {
    question: "How do I rent a vehicle?",
    answer:
      "Simply browse available vehicles, select your preferred one, choose your date range, and proceed with booking online.",
  },
  {
    question: "What documents do I need to provide?",
    answer:
      "You’ll need a valid government-issued license, an identity proof (e.g., citizenship, passport), and in some cases, a local address.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes. If you’ve selected a Standard or Premium rate, you can cancel or modify your booking for free up to 24 hours before pickup.",
  },
  {
    question: "Is fuel included in the rental price?",
    answer:
      "No, the renter is responsible for fuel. The vehicle must be returned with the same fuel level as at pickup.",
  },
  {
    question: "Do you offer roadside assistance?",
    answer:
      "Yes. We offer 24/7 roadside assistance for all rentals with Premium Cover.",
  },
  {
    question: "Can I rent out my own vehicle?",
    answer:
      "Yes! Vehicle owners can list their vehicles on EasyWheels to earn passive income. Go to the 'Become a Partner' section to get started.",
  },
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="px-6 py-12 max-w-5xl mx-auto">
        <section id="faq-section" className="py-5">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <span className="text-2xl">
                    {openIndex === index ? '-' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default FAQPage;