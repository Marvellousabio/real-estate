import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animate';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    alert('Thank you for your message! We’ll get back to you soon.');
    // Here you could add logic to send the form data to an API
  };

 
// Inside the component:
<LoadScript googleMapsApiKey="YOUR_API_KEY">
  <GoogleMap
    mapContainerStyle={{ width: '100%', height: '192px', borderRadius: '8px' }}
    center={{ lat: 6.5244, lng: 3.3792 }} // Example: Lagos, Nigeria
    zoom={12}
  />
</LoadScript>
  return (
    <section id='contact'  className=' py-20 bg-[var(--light-gray)] min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          variants={fadeIn('down', 0.1)}
          initial='hidden'
          animate={'show'}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1 className='text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4'>
            Get in <span className='text-[var(--accent)]'>Touch</span>
          </h1>
          <p className='text-[var(--text-dark)] max-w-2xl mx-auto text-lg opacity-80'>
            We’re here to assist you with all your real estate needs. Reach out today!
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <motion.div
            variants={fadeIn('up', 0.1)}
            initial='hidden'
            animate='show'
            transition={{ duration: 0.5, delay: 0.1 }}
            className='bg-white p-8 rounded-xl shadow-lg'
          >
            <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6'>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label htmlFor='name' className='block text-[var(--text-dark)] font-medium mb-2'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  required
                  className='w-full px-4 py-3 border border-[var(--light-gray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
                  placeholder='Your Name'
                />
              </div>
              <div>
                <label htmlFor='email' className='block text-[var(--text-dark)] font-medium mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  required
                  className='w-full px-4 py-3 border border-[var(--light-gray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
                  placeholder='Your Email'
                />
              </div>
              <div>
                <label htmlFor='message' className='block text-[var(--text-dark)] font-medium mb-2'>
                  Message
                </label>
                <textarea
                  id='message'
                  required
                  rows='4'
                  className='w-full px-4 py-3 border border-[var(--light-gray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'
                  placeholder='Your Message'
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type='submit'
                className='w-full bg-[var(--primary)] text-white px-6 py-3 rounded-full hover:bg-[var(--hover-secondary)] transition-colors duration-300 shadow-md'
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            variants={fadeIn('up', 0.1)}
            initial='hidden'
            animate='show'
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-8'
          >
            <div className='bg-white p-8 rounded-xl shadow-lg'>
              <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6'>Contact Details</h2>
              <ul className='space-y-6'>
                <li className='flex items-center space-x-4'>
                  <FaPhoneAlt className='text-[var(--accent)] text-xl' />
                  <span className='text-[var(--text-dark)] opacity-80'>08022871344</span>
                </li>
                <li className='flex items-center space-x-4'>
                  <FaEnvelope className='text-[var(--accent)] text-xl' />
                  <a href='mailto:marvellousabiola08@gmail.com' className='text-[var(--text-dark)] opacity-80 hover:text-[var(--accent)] transition-colors duration-300'>
                    marvellousabiola08@gmail.com
                  </a>
                </li>
                <li className='flex items-center space-x-4'>
                  <FaMapMarkerAlt className='text-[var(--accent)] text-xl' />
                  <span className='text-[var(--text-dark)] opacity-80'>Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
            <div className='bg-white p-8 rounded-xl shadow-lg'>
              <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6 flex gap-2'><FaMapMarkerAlt className='text-[var(--accent)] text-2xl' />Our Location</h2>
              
              <div className='w-full h-48 bg-[var(--light-gray)] rounded-lg flex items-center justify-center'>
                <iframe
      title="Google Maps"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7262569811!2d3.3792!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4f16da11c2f%3A0xf2a69f84fcd2a7b!2sUniversity%20of%20Lagos!5e0!3m2!1sen!2sng!4v1693652112345!5m2!1sen!2sng"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;