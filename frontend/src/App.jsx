import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './components/About';
import Property from './components/Property';
import More from './components/More';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AddProperty from './pages/AddProperty';
import AllProperites from './pages/AllProperties';
import PropertyFilterSystem from './pages/PropertyFilterSystem';
import BlogDetails from './pages/BlogDetails';
import  CreateBlog from './pages/CreateBlog';
import './App.css'


const App = () => {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyFilterSystem />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Property />} />
          <Route path="/more" element={<More />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='all-properties' element={<AllProperites/>}/>
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="*" element={<h1 className="mt-20 p-6">404 - Page Not Found</h1>} />
        </Routes>
      <Footer className="bottom-0 fixed mb-0" />
    </Router>
  );
};

export default App;