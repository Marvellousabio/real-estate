import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animate';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Home Buyer',
      image: '/image/testimonial1.jpg',
      content: 'The team at Real Estate helped me find my dream home in just two weeks. Their expertise and dedication made the entire process smooth and stress-free.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Investor',
      image: '/image/testimonial2.jpg',
      content: 'I\'ve been working with this agency for over 5 years for my investment properties. Their market knowledge and negotiation skills are unmatched.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'First-time Seller',
      image: '/image/testimonial3.jpg',
      content: 'As a first-time seller, I was nervous about the process. The team guided me through every step and got me the best possible price for my home.',
      rating: 5
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'David Thompson',
      role: 'Senior Real Estate Agent',
      image: '/image/agent1.jpg',
      experience: '10+ years'
    },
    {
      id: 2,
      name: 'Lisa Park',
      role: 'Property Consultant',
      image: '/image/agent2.jpg',
      experience: '8+ years'
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'Commercial Specialist',
      image: '/image/agent3.jpg',
      experience: '12+ years'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Testimonials Section */}
        <motion.div
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.7 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4'>
            What Our Clients Say
          </h2>
          <p className='text-[var(--primary)] max-w-2xl mx-auto text-lg opacity-80'>
            Don't just take our word for it - hear from our satisfied clients.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={fadeIn('up', 0.2 + index * 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.3 }}
              className='bg-[var(--card-background)] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center mb-4'>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className='w-12 h-12 rounded-full object-cover mr-4'
                  onError={(e) => {
                    e.target.src = '/image/no-image.png';
                  }}
                />
                <div>
                  <h4 className='font-semibold text-[var(--primary)]'>{testimonial.name}</h4>
                  <p className='text-sm text-[var(--primary)] opacity-70'>{testimonial.role}</p>
                </div>
              </div>
              <div className='flex mb-3'>
                {renderStars(testimonial.rating)}
              </div>
              <p className='text-[var(--primary)] opacity-80 italic'>"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>

        {/* Team Members Section */}
        <motion.div
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.7 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4'>
            Meet Our Expert Team
          </h2>
          <p className='text-[var(--primary)] max-w-2xl mx-auto text-lg opacity-80'>
            Our experienced professionals are here to help you achieve your real estate goals.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={fadeIn('up', 0.2 + index * 0.1)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.3 }}
              className='bg-[var(--card-background)] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center'
            >
              <img
                src={member.image}
                alt={member.name}
                className='w-24 h-24 rounded-full object-cover mx-auto mb-4'
                onError={(e) => {
                  e.target.src = '/image/no-image.png';
                }}
              />
              <h4 className='text-xl font-semibold text-[var(--primary)] mb-2'>{member.name}</h4>
              <p className='text-[var(--accent)] font-medium mb-2'>{member.role}</p>
              <p className='text-[var(--primary)] opacity-70'>{member.experience} experience</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;