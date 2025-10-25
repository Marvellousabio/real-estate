import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animate';
import { Rent } from '../data/Data';

const PropertyForRent = () => {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <motion.div
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.7 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4'>
            Browse Properties for Rent Near You
          </h2>
          <p className='text-[var(--primary)] max-w-2xl mx-auto text-lg opacity-80'>
            Find the perfect rental property in your desired location with our curated selection.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Rent.slice(0, 6).map((property, index) => (
            <motion.div
              key={property.id || index}
              variants={fadeIn('up', 0.2 + index * 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.3 }}
              className='bg-[var(--card-background)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105'
            >
              <div className='relative'>
                <img
                  src={property.image}
                  alt={property.location}
                  className='w-full h-48 object-cover'
                />
                <div className='absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md'>
                  <span className='text-sm font-semibold text-[var(--accent)]'>For Rent</span>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-[var(--primary)] mb-2'>
                  {property.location}
                </h3>
                <p className='text-xl font-bold text-[var(--accent)] mb-2'>
                  {property.price}
                </p>
                <div className='flex justify-between text-sm text-[var(--primary)] opacity-70'>
                  <span>{property.beds} Beds</span>
                  <span>{property.baths} Baths</span>
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
              className='bg-[var(--accent)] text-white px-8 py-3 rounded-lg hover:bg-[var(--hover-accent)] transition-colors duration-300 shadow-md'
            >
              View All Properties
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyForRent;