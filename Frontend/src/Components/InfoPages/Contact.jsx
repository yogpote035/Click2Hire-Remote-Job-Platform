import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r  from-[#2563EB] via-[#F97316] to-[#1E3A8A] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Have questions? We’d love to hear from you. Let’s connect!
        </p>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Whether you’re a job seeker or an employer, we’re here to help.
            Reach out to us anytime.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <span className="text-indigo-600 text-2xl">📧</span>
              <span>support@click2hire.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-indigo-600 text-2xl">📞</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-indigo-600 text-2xl">📍</span>
              <span>Pune, Maharashtra, India</span>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
