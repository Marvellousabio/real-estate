import React from 'react';
import {Link} from 'react-router-dom';
import Im1 from '../assets/im1.jpg';
import Im2 from '../assets/im2.jpg';
import Im3 from '../assets/im3.jpg';
import Im4 from '../assets/im4.jpg';
import { FaRegHeart } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { fadeIn } from '../utils/animate';
import { motion } from 'framer-motion';
import { Properties } from '../data/Data';



const Property = () => {
  const properties = [
    { img: Im3, price: "$930,000", location: "192 Lombard St, San Francisco, CA 94123", sqft: "2,238", beds: "3", baths: "2" },
    { img: Im2, price: "$930,000", location: "192 Lombard St, San Francisco, CA 94123", sqft: "2,238", beds: "3", baths: "2" },
    { img: Im1, price: "$930,000", location: "192 Lombard St, San Francisco, CA 94123", sqft: "2,238", beds: "3", baths: "2" },
    { img: Im4, price: "$930,000", location: "192 Lombard St, San Francisco, CA 94123", sqft: "2,238", beds: "3", baths: "2" },
  ];

  return (
    <section  className='py-20 bg-[var(--light-gray)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.7 }}
          className='text-center mb-12'
        >
          <h3 className='text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4'>
            Discover Your Perfect <span className='text-[var(--accent)]'>Property Match</span>
          </h3>
          <p className='text-[var(--text-dark)] max-w-2xl mx-auto text-lg opacity-80'>
            Find your ideal home with our extensive network of real estate agents home close to you.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {properties.map((property, index) => (
            <motion.div
              key={index}
              className={`${index === 0 ? 'md:row-span-2' : index === 3 ? 'md:col-span-2' : ''} relative group`}
              variants={fadeIn('up', 0.2 + index * 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.3 }}
            >
              <img
                src={property.img}
                alt={`Property at ${property.location}`}
                className={`w-full ${index === 0 ? 'h-[500px]' : index === 3 ? 'h-[200px]' : 'h-[250px]'} object-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-[1.02]`}
              />
              <button className='absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <FaRegHeart className='text-[var(--secondary)] hover:text-[var(--accent)] text-xl' />
              </button>
              <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xl font-bold text-[var(--primary)]'>{property.price}</p>
                  <button className='bg-[var(--secondary)] p-2 rounded-full hover:bg-[var(--accent)] transition-colors duration-300'>
                    <MdArrowOutward className='text-white text-xl' />
                  </button>
                </div>
                <p className='text-sm text-[var(--text-dark)] opacity-80 truncate'>{property.location}</p>
                <div className='flex justify-between text-sm mt-2 text-[var(--text-dark)]'>
                  <span><span className='text-[var(--accent)] font-semibold'>{property.sqft}</span> Sq.Ft.</span>
                  <span><span className='text-[var(--accent)] font-semibold'>{property.beds}</span> Beds</span>
                  <span><span className='text-[var(--accent)] font-semibold'>{property.baths}</span> Baths</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Link to="/all-properties">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-[var(--accent)] text-#DCC9B6 px-8 py-3 rounded-full hover:bg-[var(--accent)] transition-colors duration-300 shadow-md'
          >
            View All Properties
          </motion.button>
          </Link>
          
        </div>
      </div>
    </section>
  );
};

export default Property;