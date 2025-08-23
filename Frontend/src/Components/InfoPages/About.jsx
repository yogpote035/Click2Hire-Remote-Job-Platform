import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2563EB] via-[#F97316] to-[#1E3A8A] text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold">
          <span className="text-[#2563EB]">Click</span>
          <span className="text-[#ffffff]">2</span>
          <span className="text-[#1E3A8A]">Hire</span>
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Click2Hire
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Connecting talent with opportunities — anywhere, anytime.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-3">🎯 Our Mission</h2>
          <p className="text-gray-600">
            To simplify remote hiring for companies and empower job seekers with
            equal access to global opportunities.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-3">🌍 Our Vision</h2>
          <p className="text-gray-600">
            Building a world where distance is never a barrier to career growth
            and collaboration.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Click2Hire started as a student project with the vision to create a
            smart platform for connecting job seekers and companies in the
            growing remote-first world. From freelancers to fresh graduates, we
            make the hiring journey transparent, secure, and efficient.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🌍", text: "Global Remote Jobs" },
            { icon: "⚡", text: "Quick Applications" },
            { icon: "📄", text: "Resume Parsing (ATS Friendly)" },
            { icon: "🔒", text: "Secure & Transparent Hiring" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className="font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Click2Hire Today
        </h2>
        <p className="mb-6 max-w-xl mx-auto">
          Unlock your next opportunity and explore jobs across the globe.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
        >
          Explore Jobs
        </button>
      </section>
    </div>
  );
};

export default About;
