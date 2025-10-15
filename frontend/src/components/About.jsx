import React from 'react';
import AboutI from '../assets/about.jpg';
import AnimatedCounter from '../utils/AnimatedCounter';

import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animate';

const About = () => {
  return (
    <section id='about' className='py-20 bg-[var(--light-gray)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-[var(--primary)] flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden relative'>
          {/* Left Section */}
          <motion.div
            variants={fadeIn('right', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.7 }}
            className='md:w-1/2 p-8 lg:p-12 flex flex-col justify-center'
          >
            <div className='flex items-center gap-3 mb-6'>
              <h1 className='text-4xl font-bold text-white'>About</h1>
              <span className='text-4xl font-bold text-[var(--accent)]'>Us</span>
            </div>
            <div className='space-y-4'>
              <p className='text-[var(--light-gray)] opacity-90 leading-relaxed'>
                We’re your trusted partner in real estate. Our agency specializes in premium services for buying, selling, and managing properties in San Francisco, CA, and beyond.
              </p>
              <p className='text-[var(--light-gray)] opacity-90 leading-relaxed'>
                We pride ourselves on delivering personalized solutions tailored to your unique needs. Our experienced team of real estate agents is dedicated to guiding you through every step—from initial consultation to final closing—with transparency, professionalism, and expertise.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-8 bg-[var(--accent)] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[var(--accent)]/90 transition-all duration-300'
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Right Section */}
          <motion.div
            variants={fadeIn('left', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.7 }}
            className='md:w-1/2'
          >
            <img
              src={AboutI}
              alt='About us'
              loading='lazy'
              className='w-full h-full object-cover min-h-[300px] md:min-h-[400px] '
            />
            <motion.div
        variants={fadeIn('left',0.3)}
        initial='hidden'
          whileInView={'show'}
          viewport={{once:false, amount:0.7}}
          animate={{ opacity: 4, y: 3 }}
          transition={{ duration: 0.8 }}
        className='absolute  bottom-0 right-0 bg-white text-black p-4 text-left rounded-tl-2xl min-w-[300px] max-w-[400px]'>
            <h1 className='text-2xl text-[var(--primary)] font-semibold mb-2'>Who We Are?</h1>
            <p className='text-gray-700 leading-snug'>We offer a range of service including buying and selling of lands and property management</p>
            <div className='flex justify-between mt-4 '>
              <div>
              <h1 className='text-[var(--gold)] text-2xl'><AnimatedCounter value={80} duration={2}/><span>+</span></h1>
                <p>Premium House</p>
              </div>
              <div>
              <h1 className='text-[var(--gold)] text-2xl'><AnimatedCounter value={50} duration={2} />
              <span>+</span></h1>
                <p>Premium House</p>
              </div>
              <div>
                <h1 className='text-[var(--gold)] text-2xl'><AnimatedCounter value={2000} duration={2} />
                <span>+</span></h1>
                <p>Premium House</p>
              </div>
            </div>
          </motion.div>
          </motion.div>
        
        </div>
      </div>
    </section>
  );
};

export default About;