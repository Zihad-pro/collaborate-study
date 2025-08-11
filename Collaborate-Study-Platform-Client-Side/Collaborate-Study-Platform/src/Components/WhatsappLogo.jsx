import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsappLogo = () => {
  return (
    <a
      href="https://wa.me/8801896016252"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition transform hover:scale-110"
    >
      <FaWhatsapp className="text-2xl md:text-4xl" />
    </a>
  );
};

export default WhatsappLogo;