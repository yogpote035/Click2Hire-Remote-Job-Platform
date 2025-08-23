import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r  from-[#2563EB] via-[#F97316] to-[#1E3A8A] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Your privacy matters to us. Learn how Click2Hire collects, uses, and
          protects your information.
        </p>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We may collect personal details such as your name, email address,
            phone number, and resume details when you sign up or apply for jobs
            on Click2Hire. Non-personal data like browser type, device, and IP
            address may also be collected to improve our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">2. How We Use Your Data</h2>
          <p className="text-gray-700 leading-relaxed">
            The information you provide is used to connect you with job
            opportunities, improve your experience, send important updates, and
            ensure platform security. We never sell your personal data to third
            parties.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">3. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We use industry-standard encryption and secure servers to protect
            your information. While we take every precaution, no method of data
            storage or transmission is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">4. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Click2Hire uses cookies to improve functionality and personalize
            your experience. You may disable cookies in your browser settings,
            but some features may not work properly.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">5. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, update, or delete your personal
            information. You may also opt out of receiving promotional emails at
            any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">6. Changes to this Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page with an updated "Last Updated" date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">7. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions regarding this Privacy Policy, please
            reach out to us at{" "}
            <span className="text-indigo-600 font-medium">
              support@click2hire.com
            </span>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
