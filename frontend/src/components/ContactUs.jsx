import React, { useState } from "react";
import {
  FaCheck,
  FaComment,
  FaEnvelope,
  FaPaperPlane,
  FaPhone,
  FaTag,
  FaUser,
} from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);

  const whatsappNumber = "1234567892";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;

    if (!name || !email || !phone || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    const text =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Subject: ${subject}\n` +
      `Message: ${message}`;

    const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-linear-to-br from-emerald-900 via-emerald-950 to-black px-4 py-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg animate-slideIn">
          <FaCheck className="mr-2 text-white" />
          <span>Message opened in WhatsApp!</span>
        </div>
      )}

      {/* Contact Form Container */}
      <div className="relative w-full max-w-lg bg-white/10 border border-emerald-400/30 backdrop-blur-md rounded-2xl p-8 shadow-2xl z-10">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Contact <span className="text-emerald-400">FreshGroceries</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center bg-white/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <FaUser className="text-emerald-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-emerald-200 outline-none"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-white/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <FaEnvelope className="text-emerald-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-emerald-200 outline-none"
              placeholder="Email Address"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center bg-white/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <FaPhone className="text-emerald-400 mr-2" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-emerald-200 outline-none"
              placeholder="(123) 456-7890"
              required
            />
          </div>

          {/* Subject */}
          <div className="flex items-center bg-white/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <FaTag className="text-emerald-400 mr-2" />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-emerald-200 outline-none"
              placeholder="Subject"
              required
            />
          </div>

          {/* Message */}
          <div className="flex items-start bg-white/10 border border-emerald-400/30 rounded-lg px-3 py-2">
            <FaComment className="text-emerald-400 mr-2 mt-2" />
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-emerald-200 outline-none resize-none"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-emerald-400 text-black font-semibold py-3 rounded-lg hover:bg-emerald-300 transition-all duration-300 shadow-lg"
          >
            <span>Send Message</span>
            <FaPaperPlane className="text-black" />
          </button>
        </form>
      </div>

      {/* Animated Toast Keyframes */}
      <style>
        {`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-in-out;
        }
        `}
      </style>
    </div>
  );
};

export default ContactUs;
