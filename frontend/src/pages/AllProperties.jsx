import React, { useEffect, useState,useRef, useCallback } from "react";
import { getProperties } from "../services/api";
import PropertyCard from "../components/PropertyCard"
import { Link } from "react-router-dom"; // import Link
import { useAuth } from "../context/AuthContext";


const PropertySkeleton = () => (
  <div className="bg-gray-200 animate-pulse rounded-xl h-64 w-full shadow-md"></div>
);

export default function PropertyList() {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [observerSupported, setObserverSupported] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'my'
  const limit = 10;

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setProperties([]);
    setHasMore(true);
  };
 

    const observer = useRef();

    
  const lastPropertyRef=useCallback(
    (node)=>{
    if(loading) return;
     if (!("IntersectionObserver" in window)){
      setObserverSupported(false);
      return;
     }

    if (observer.current) observer.current.disconnect();

    observer.current=new IntersectionObserver((entries)=>{
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev)=>prev+1);
      }
    });
    if (node) observer.current.observe(node);
    },
  [loading,hasMore]
);

  useEffect(() => {

    const fetchData = async () => {
      if (!hasMore ) return;
    setLoading(true);
      try {
        const params = { page, limit };
        if (filter === 'my') {
          params.myProperties = true;
        }
        const res = await getProperties(params);
        const newProperties = res?.data || [];
        setProperties((prev) => {
        const filteredNewProps = newProperties.filter(
          (p) => !prev.some((existing) => existing._id === p._id)
        );
        return [...prev, ...filteredNewProps];
      });
        if (newProperties.length < limit){
          setHasMore(false);
        }
      } catch {
        // Silently handle errors to avoid console serialization issues
      } finally {
        setLoading(false);
      }
    };
  fetchData();
   }, [page, hasMore, filter]);



  return (
    <div className=" min-h-screen max-w-6xl mx-auto my-20  p-6">
      {/* Header with button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {filter === 'my' ? 'My Properties' : 'Available Properties'}
        </h2>

        {/* Filter Buttons */}
        {isAuthenticated && (
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => handleFilterChange('my')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              My Properties
            </button>
          </div>
        )}

        {/* Add Property Button */}
        <Link
          to="/add-property"
          className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Property
        </Link>
      </div>

      {Array.isArray(properties) && properties.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {properties.map((p,index) => {
      if (index === properties.length - 1) {
            // Attach ref to last item
            return <PropertyCard ref={lastPropertyRef} key={p._id} p={p} />;
          } 
      return <PropertyCard key={p._id } p={p} />
})}
  </div>
) : (
  <p className="text-center text-gray-600">
    No properties found. Please add one!
  </p>
)}
    {/* Loading Skeleton */}
      {loading && properties.length > 0 && hasMore && (Array.from({ length: limit }).map((_, idx) => (
        <PropertySkeleton key={`skeleton-${idx}`} />
      ))
    )}

   


      {!loading && hasMore && !observerSupported &&(
        <div className="text-center mt-6">
          <button
          onClick={()=> setPage((prev)=>prev+1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Load More
      </button>
      </div>
        )}

      {!hasMore && (
        <div className="text-center py-6 text-gray-500 font-medium">
           You’ve reached the end!
        </div>
      )}
      
    </div>
  );
}
