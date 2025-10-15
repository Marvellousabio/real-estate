import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperties } from "../services/api";
import QuickSearch from "../components/QuickSearch";
import CustomAlert from "../components/CustomAlert";

const PropertyFilterSystem = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000); // auto close after 5s
  };
  const [filters, setFilters] = useState({
    category: "buy",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minSize: "",
    maxSize: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("price-low");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 5000); 

    return () => {
      clearTimeout(handler); // Clear timeout if user types again
    };
  }, [searchQuery]);
  // Load filters from URL
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setFilters((prev) => ({
      ...prev,
      category: params.get("category") || prev.category,
      propertyType: params.get("propertyType") || prev.propertyType,
      location: params.get("location") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      bedrooms: params.get("bedrooms") || "",
      bathrooms: params.get("bathrooms") || "",
      minSize: params.get("minSize") || "",
      maxSize: params.get("maxSize") || "",
    }));
    const searchParam = params.get("search");
    if (searchParam !== null) {
      setSearchQuery(searchParam);
      setDebouncedSearch(searchParam);
    }
    setSortBy(params.get("sortBy") || "price-low");
  }, [locationHook.search]);

  // Update URL on filters/search/sort change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (sortBy) params.set("sortBy", sortBy);
    navigate(`/properties?${params.toString()}`, { replace: true });
  }, [filters,debouncedSearch, sortBy, navigate]);

  // Fetch filtered properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties({
         
          category: filters.category,
          propertyType: filters.propertyType,
          location: filters.location,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          minSize: filters.minSize,
          maxSize: filters.maxSize,
          search: debouncedSearch, // Use debounced search here
          sortBy,
        });
        setProperties(data);
      } catch (err) {
        console.error("Cannot fetch properties:", err);
        showAlert(`Cannot fetch properties: ${err}`,"error");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  
  }, [filters,debouncedSearch, sortBy]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading)
    return (
      <p className="text-center mt-20 min-h-screen">Loading Properties....</p>
    );

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 mt-20">
      <QuickSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {property.type} in {property.location}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      property.status === "for-sale"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{property.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bedrooms:</span>
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bathrooms:</span>
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span>{property.size} sqm</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No properties found matching your criteria.
          </div>
        )}
        
      </div>
      {alert.message && (
          <CustomAlert
             message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
          />
        )}
    </div>
  );
};

export default PropertyFilterSystem;
