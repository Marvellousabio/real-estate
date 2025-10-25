// Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import PropertyForSale from '../components/PropertyForSale';
import PropertyForRent from '../components/PropertyForRent';
import PropertyTopPicks from '../components/PropertyTopPicks';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import More from '../components/More';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <PropertyForSale />
      <PropertyForRent />
      <PropertyTopPicks />
      <About />
      <Testimonials />
      <More />
      <Contact />
    </>
  );
};

export default Home;
