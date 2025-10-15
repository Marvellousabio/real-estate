// Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Property from '../components/Property';
import About from '../components/About';
import Showcase from '../components/Showcase';
import More from '../components/More';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Property />
      <About />
      <Showcase />
      <More />
      <Contact />
    </>
  );
};

export default Home;
