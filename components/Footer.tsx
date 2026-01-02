import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaAngleRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1A76D1] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* قسم CONTACT US */}
          <div>
            <h2 className="text-xl font-bold text-white uppercase mb-4 border-b-2 border-blue-300 pb-1">
              CONTACT US
            </h2>
            <p className="text-gray-200 mb-4">
              Feel free to contact us for accurate medical consultations
              and AI-powered image analysis.
            </p>
            <div className="space-y-2">
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-300" />
                <span>Constantine, Ali Mendjli UV05</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-300" />
                <span>Healthaiplus@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaPhone className="text-blue-300" />
                <span>‪+213 785515638‬</span>
              </p>
            </div>
          </div>

          {/* قسم QUICK LINKS */}
          <div>
            <h2 className="text-xl font-bold text-white uppercase mb-4 border-b-2 border-blue-300 pb-1">
              QUICK LINKS
            </h2>
            <ul className="space-y-2">
              {["Home", "About Us", "Our Services", "Meet The Team", "Latest Blog", "Contact Us"].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <FaAngleRight className="text-blue-300" />
                  <a href="#" className="hover:text-gray-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-blue-400 mt-6 pt-4 text-center text-gray-200">
          <p>© <span className="text-blue-300 font-bold">HEALTH AI+</span>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;