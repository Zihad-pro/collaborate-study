import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const FaqSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 700, // animation duration
      once: true, // animate only once on scroll
    });
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-[#f3fdfb] to-white pb-15">
      <div className="max-w-3xl mx-auto space-y-3 p-6">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div className="collapse-title font-semibold cursor-pointer">
            How do I create an account?
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            I forgot my password. What should I do?
          </div>
          <div className="collapse-content text-sm">
            Click on "Forgot Password" on the login page and follow the
            instructions sent to your email.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            How do I update my profile information?
          </div>
          <div className="collapse-content text-sm">
            Go to "My Account" settings and select "Edit Profile" to make
            changes.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            Are live classes recorded?
          </div>
          <div className="collapse-content text-sm">
            Yes, all live classes are recorded and available to watch anytime in
            your dashboard.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            How can I get help if I’m stuck?
          </div>
          <div className="collapse-content text-sm">
            Use the chat support or post your questions in the course forum to
            get help from tutors or peers.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            Can I download course materials?
          </div>
          <div className="collapse-content text-sm">
            Yes, downloadable PDFs and resources are available within each
            course section.
          </div>
        </div>

        <div
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold cursor-pointer">
            What payment methods are accepted?
          </div>
          <div className="collapse-content text-sm">
            We accept credit/debit cards, Bkash, Nagad, and other popular mobile
            wallets.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
