import React from 'react';
import { MdRealEstateAgent } from "react-icons/md";
import { FaEnvelope, FaFacebook, FaPhoneAlt, FaMapMarkerAlt, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animate';

const Footer = () => {
  return (
    <footer className="bg-[var(--primary)] text-[var(--light-gray)] w-full py-12 px-4 sm:px-6 lg:px-8 position-bottom mb-0">
      <motion.div
        variants={fadeIn('left', 0.1)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: true, amount: 0.1 }}
        className=" mx-auto"
      >
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">Real Estate</h1>
              <MdRealEstateAgent className="text-3xl text-[var(--accent)]" />
            </div>
            <p className="text-[var(--light-gray)] opacity-80 leading-relaxed">
              We help you sell your properties, buy new homes, and find the perfect rental apartment.
            </p>
            <div className="flex space-x-6 pt-2">
              <a href="https://facebook.com" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="https://twitter.com" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://linkedin.com" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">
                <FaLinkedinIn className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-white">Quick Links</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Properties</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Services</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Testimonials</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-white">Contact Us</h5>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-[var(--accent)] text-lg" />
                <span className="opacity-80">08022871344</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-[var(--accent)] text-lg" />
                <a href="mailto:marvellousabiola08@gmail.com" className="hover:text-[var(--accent)] transition-colors duration-300 opacity-80">
                  marvellousabiola08@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-[var(--accent)] text-lg" />
                <span className="opacity-80">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-white">Support</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">FAQs</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-[var(--light-gray)] hover:text-[var(--accent)] transition-colors duration-300">Support Center</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--light-gray)]/20 mt-12 pt-8 text-center text-sm text-[var(--light-gray)] opacity-70">
          <p>© {new Date().getFullYear()} Real Estate. All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;