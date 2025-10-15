import React, { useState, useCallback, memo } from "react";
import { FaChevronLeft, FaChevronRight, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import FaNairaSign from "../icons/FaNairaSign";
import NoImage from "../icons/no-image.png";

const PropertyCard = memo(React.forwardRef(({ property }, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Defensive programming for images
  const images = React.useMemo(() => {
    if (Array.isArray(property?.images) && property.images.length > 0) {
      return property.images.filter(img => img && typeof img === 'string');
    }
    return [NoImage];
  }, [property?.images]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const formatPrice = useCallback((price) => {
    if (!price || isNaN(price)) return "Price not available";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  const formatCategory = useCallback((category) => {
    if (!category) return "";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, []);

  if (!property) {
    return (
      <div ref={ref} className="bg-white shadow-lg rounded-xl overflow-hidden border animate-pulse">
        <div className="h-40 bg-gray-200"></div>
        <div className="p-5 space-y-3">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-white shadow-lg rounded-xl overflow-hidden border hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`${property.title || "Property"} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = NoImage;
          }}
        />

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FaChevronRight size={12} />
            </button>
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            property.category === 'sell'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {formatCategory(property.category)}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
          {property.title || "Untitled Property"}
        </h3>

        <p className="text-gray-600 mb-3 flex items-center text-sm">
          <span className="mr-1">📍</span>
          {property.location || "Location not specified"}
        </p>

        <div className="mb-4">
          <p className="text-green-700 font-bold text-lg flex items-center gap-1">
            <FaNairaSign style={{ fontWeight: "bold", opacity: 0.9 }} />
            {formatPrice(property.price)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaBed className="text-green-600" />
            <span>{property.bedrooms ?? 0} Bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="text-green-600" />
            <span>{property.bathrooms ?? 0} Bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-green-600" />
            <span>{property.size ? `${property.size} sqft` : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}));

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
