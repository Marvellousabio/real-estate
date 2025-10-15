import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickSearch = ({ searchQuery, setSearchQuery, filters }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    // Add search query
    if (searchQuery) params.set('search', searchQuery);

    // Navigate to updated URL
    navigate(`/properties?${params.toString()}`);
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white shadow p-4 mb-4 rounded-lg">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleEnterPress}
          placeholder="Search properties quickly..."
          className="flex-1 border border-gray-300 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition ml-2"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default QuickSearch;
