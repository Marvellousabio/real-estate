import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../index.css';
import { Properties, Rent } from '../data/Data';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaRegHeart } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

const Showcase = () => {
  const sliderLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const sliderRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const formSubmit = () => {
    alert('We will get back to you in a moment');
  };

  return (
    <section id='properties' className='mt-20 py-16 bg-[var(--light-gray)] min-h-screen'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-[var(--primary)] text-center mb-12'>
          Our Properties
        </h1>

        <Tabs>
          <TabList className='flex justify-center mb-8 space-x-4'>
            <Tab className='px-6 py-2 rounded-full cursor-pointer text-[var(--text-dark)] font-medium focus:outline-none focus:bg-[var(--secondary)] focus:text-white bg-white shadow-md hover:bg-[var(--secondary)] hover:text-white transition-colors duration-300'>
              Buy
            </Tab>
            <Tab className='px-6 py-2 rounded-full cursor-pointer text-[var(--text-dark)] font-medium focus:outline-none focus:bg-[var(--secondary)] focus:text-white bg-white shadow-md hover:bg-[var(--secondary)] hover:text-white transition-colors duration-300'>
              Rent
            </Tab>
            <Tab className='px-6 py-2 rounded-full cursor-pointer text-[var(--text-dark)] font-medium focus:outline-none focus:bg-[var(--secondary)] focus:text-white bg-white shadow-md hover:bg-[var(--secondary)] hover:text-white transition-colors duration-300'>
              Sell
            </Tab>
          </TabList>

          <TabPanel>
            <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6 text-center'>
              The Best Affordable Homes
            </h2>
            <div className='relative flex items-center'>
              <MdChevronLeft size={40} onClick={sliderLeft} className='text-[var(--primary)] opacity-70 cursor-pointer hover:opacity-100 transition-opacity z-10' />
              <div id="slider" className='w-full overflow-x-scroll scroll-smooth whitespace-nowrap py-4 px-2'>
                {Properties.map((item, id) => (
                  <div key={id} className='inline-block px-3'>
                    <div className='w-[300px] bg-white rounded-lg shadow-[var(--shadow)] overflow-hidden transform hover:scale-105 transition-transform duration-300'>
                      <div className='relative group'>
                        <img 
                          className='w-full h-[200px] object-cover'
                          src={item.image} 
                          alt={item.location}
                        />
                        <button className='absolute top-3 right-3 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <FaRegHeart className='text-[var(--secondary)] hover:text-[var(--accent)] text-xl' />
                        </button>
                      </div>
                      <div className='p-4'>
                        <div className='flex justify-between items-center mb-2'>
                          <h3 className='text-xl font-semibold text-[var(--primary)]'>
                            {item.location}
                          </h3>
                          <MdArrowOutward className='text-[var(--secondary)] text-2xl hover:text-[var(--accent)]' />
                        </div>
                        <div className='flex justify-between text-[var(--text-dark)] text-sm'>
                          <span>Price: <strong>{item.price}</strong></span>
                          <span>Beds: <strong>{item.beds}</strong></span>
                          <span>Baths: <strong>{item.baths}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <MdChevronRight size={40} onClick={sliderRight} className='text-[var(--primary)] opacity-70 cursor-pointer hover:opacity-100 transition-opacity z-10' />
            </div>
          </TabPanel>

          <TabPanel>
            <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6 text-center'>
              Rent the BEST Appointment <span>Faster</span> <span className='text-yellow-300'>Better</span> <span>Easier</span>
            </h2>
            <div className='relative flex items-center'>
              <MdChevronLeft size={40} onClick={sliderLeft} className='text-[var(--primary)] opacity-70 cursor-pointer hover:opacity-100 transition-opacity z-10' />
              <div id="slider" className='w-full overflow-x-scroll scroll-smooth whitespace-nowrap py-4 px-2'>
                {Rent.map((item, id) => (
                  <div key={id} className='inline-block px-3'>
                    <div className='w-[300px] bg-white rounded-lg shadow-[var(--shadow)] overflow-hidden transform hover:scale-105 transition-transform duration-300'>
                      <div className='relative group'>
                        <img 
                          className='w-full h-[200px] object-cover'
                          src={item.image} 
                          alt={item.location}
                        />
                        <button className='absolute top-3 right-3 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <FaRegHeart className='text-[var(--secondary)] hover:text-[var(--accent)] text-xl' />
                        </button>
                      </div>
                      <div className='p-4'>
                        <div className='flex justify-between items-center mb-2'>
                          <h3 className='text-xl font-semibold text-[var(--primary)]'>
                            {item.location}
                          </h3>
                          <MdArrowOutward className='text-[var(--secondary)] text-2xl hover:text-[var(--accent)]' />
                        </div>
                        <div className='flex justify-between text-[var(--text-dark)] text-sm'>
                          <span>Price: <strong>{item.price}</strong></span>
                          <span>Beds: <strong>{item.beds}</strong></span>
                          <span>Baths: <strong>{item.baths}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <MdChevronRight size={40} onClick={sliderRight} className='text-[var(--primary)] opacity-70 cursor-pointer hover:opacity-100 transition-opacity z-10' />
            </div>
          </TabPanel>

          {/* Similar updates would be applied to the Rent TabPanel */}
          
          <TabPanel>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-[var(--primary)] mb-6'>
                List Your Property
              </h2>
              <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-[var(--shadow)]'>
                <form className='space-y-4'>
                  <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    className='w-full p-2 border rounded-md'
                  />
                  <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]' 
                    type='text' 
                    placeholder='Name' 
                    required
                  />
                  <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]' 
                    type='number' 
                    placeholder='Price' 
                    required 
                  />
                  <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]' 
                    type='text' 
                    placeholder='Location' 
                    required
                  />
                  <div className='flex space-x-4'>
                    <input 
                      className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]' 
                      type='number' 
                      placeholder='Beds' 
                      required 
                    />
                    <input 
                      className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]' 
                      type='number' 
                      placeholder='Baths' 
                      required 
                    />
                  </div>
                  <button 
                    onClick={formSubmit} 
                    className='w-full bg-[var(--secondary)] text-white py-2 rounded-md hover:bg-[var(--accent)] transition-colors duration-300'
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default Showcase;