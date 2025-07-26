import React, { useState } from 'react';

const faqs = [
  {
    question: "How do I rent a vehicle?",
    answer:
      "Renting a vehicle is simple and straightforward. Browse our extensive fleet of available vehicles, use filters to find your perfect match, select your preferred vehicle, choose your pickup and drop-off dates, provide required documentation, and complete your booking online with secure payment. You'll receive instant confirmation and detailed pickup instructions.",
  },
  {
    question: "What documents do I need to provide?",
    answer:
      "You'll need: (1) A valid driving license issued by the government, (2) Government-issued photo ID (citizenship certificate, passport, or national ID), (3) Proof of address (utility bill or bank statement), (4) Valid credit/debit card for payment and security deposit. International visitors may need an International Driving Permit (IDP) along with their home country license.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, we offer flexible cancellation and modification policies. Free cancellation up to 24 hours before pickup for Standard bookings, free cancellation up to 2 hours before pickup for Premium bookings. Modifications to dates, times, or vehicle type can be made subject to availability. Cancellation fees may apply for last-minute changes.",
  },
  {
    question: "Is fuel included in the rental price?",
    answer:
      "Fuel is not included in the rental price. Vehicles are provided with a full tank of fuel, and you're responsible for returning the vehicle with the same fuel level. If returned with less fuel, a refueling charge will apply. We recommend taking a photo of the fuel gauge at pickup and drop-off for reference.",
  },
  {
    question: "Do you offer roadside assistance?",
    answer:
      "Yes! We provide 24/7 roadside assistance for all our rentals. This includes emergency breakdown service, flat tire assistance, battery jump-start, lockout service, and emergency towing if needed. Premium customers get priority response times and additional coverage for mechanical issues.",
  },
  {
    question: "Can I rent out my own vehicle?",
    answer:
      "Absolutely! Join our host community and earn passive income by listing your vehicle. We handle insurance, customer support, and payments. You set your availability and pricing. Requirements include: vehicle registration, comprehensive insurance, safety inspection, and clean driving record. Earn up to रु 25,000+ per month depending on your vehicle type and availability.",
  },
  {
    question: "What are your age requirements for renting?",
    answer:
      "Primary drivers must be at least 21 years old with a valid driving license held for minimum 1 year. Drivers aged 21-24 may have additional restrictions and fees. Some luxury or high-performance vehicles require drivers to be 25+ years old. All drivers must be listed on the rental agreement.",
  },
  {
    question: "Do you offer insurance coverage?",
    answer:
      "Yes, all rentals include basic insurance coverage. We offer three tiers: Basic (included) - third-party liability coverage, Standard (additional cost) - collision damage waiver and theft protection, Premium (comprehensive) - full coverage with zero deductible, personal accident insurance, and roadside assistance.",
  },
  {
    question: "Can I extend my rental period?",
    answer:
      "Yes, you can extend your rental subject to vehicle availability. Contact us at least 24 hours before your scheduled return to request an extension. Additional charges will apply based on the extended duration. Same-day extensions may be possible but are subject to availability and higher rates.",
  },
  {
    question: "What happens if I return the vehicle late?",
    answer:
      "Late returns are charged on an hourly basis. Grace period of 30 minutes is provided for all bookings. After that, charges apply: रु 200 per hour for economy vehicles, रु 350 per hour for premium vehicles. If you're more than 6 hours late, a full additional day will be charged.",
  },
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="w-full md:w-full lg:w-[95vw] xl:w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-120">
        <section id="faq-section" className="py-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our vehicle rental service. 
              Can't find what you're looking for? Contact our support team.
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 sm:px-8 py-6 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset group"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors duration-200">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 text-blue-600">
                    <svg
                      className={`w-6 h-6 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                {/* Animated dropdown content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 sm:px-8 pb-6 border-t border-gray-50">
                    <p className="text-gray-700 leading-relaxed pt-4 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Our friendly support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Live Chat
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default FAQPage;
