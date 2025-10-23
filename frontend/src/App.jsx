import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./components/About'));
const Property = lazy(() => import('./components/Property'));
const More = lazy(() => import('./components/More'));
const Contact = lazy(() => import('./components/Contact'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const AllProperties = lazy(() => import('./pages/AllProperties'));
const PropertyFilterSystem = lazy(() => import('./pages/PropertyFilterSystem'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const CreateBlog = lazy(() => import('./pages/CreateBlog'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Protected Route wrapper
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

// 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a
        href="/"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyFilterSystem />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Property />} />
              <Route path="/more" element={<More />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/all-properties" element={<AllProperties />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute requiredRole='user|admin|agent'>
                      <Dashboard />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/create-blog"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute requiredRole="admin">
                      <CreateBlog />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/add-property"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute requiredRole="agent|admin">
                      <AddProperty />
                    </ProtectedRoute>
                  </Suspense>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;