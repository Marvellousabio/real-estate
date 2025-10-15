import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import AnimatedCounter from '../utils/AnimatedCounter'
import { fadeIn } from '../utils/animate'
import PropertySearch from './PropertySearch';
import { hero1, hero2, hero3 } from '../assets/assets';



const slides = [
  {
    image: hero1,
    title: 'Find Your Dream Home Today',
    subtitle: 'Welcome to our premier real estate agency',
  },
  {
    image: hero2,
    title: 'Luxury Apartments for Sale',
    subtitle: 'Discover properties that match your lifestyle',
  },
  {
    image: hero3,
    title: 'Trusted Real Estate Experts',
    subtitle: 'Helping you every step of the way',
  },
];
const Hero = () => {
  const [current,setCurrent]=useState(0);

  useEffect(()=>{
    const interval= setInterval(()=>{
      setCurrent((prev)=>(prev+1)%slides.length);
    },50000);
    return ()=>clearInterval(interval);
  },[]);

  return (
    <section id='home' className='relative h-screen flex justify-center items-center overflow-hidden '  >
    <AnimatePresence mode="wait">
    <motion.div
  key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[current].image})` }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
    >
      <div className='absolute inset-0  bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10'/> 
      
     <div className="absolute inset-0 flex flex-col z-20 items-center text-center justify-center text-white px-4 sm:mt-0 sm:mb-20 bg-black/50">
        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className="   sm:text-4xl lg:text-7xl font-bold sm:mb-1 mb-4"//text-5xl md:text-5xl lg:text-10xl
        >
          {slides[current].title}
        </motion.h1>
        <motion.p
  key={`subtitle-${current}`}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -30 }}
  transition={{ duration: 1 }}
  className="text-4xl sm:text-2xl sm:mb-10 mb-6"
>
  {slides[current].subtitle}
</motion.p>
        
        
      </div>
      
      </motion.div>
      </AnimatePresence>
      <PropertySearch />
    </section>
  );
};

export default Hero;