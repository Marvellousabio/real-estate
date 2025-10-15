import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { propertyAPI, blogAPI } from "../services/api";
import { Link } from "react-router-dom";
import { FaHome, FaBlog, FaUser, FaCog, FaSignOutAlt, FaPlus } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["user-properties"],
    queryFn: () => propertyAPI.getAll({ myProperties: "true" }),
    enabled: activeTab === "properties"
  });

  // Fetch user's blogs
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["user-blogs"],
    queryFn: () => blogAPI.getAll({ author: user?._id }),
    enabled: activeTab === "blogs"
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={properties?.data?.length || 0}
          icon={<FaHome className="text-green-600 text-xl" />}
          color="border-green-600"
        />
        <StatCard
          title="Total Blogs"
          value={blogs?.data?.length || 0}
          icon={<FaBlog className="text-blue-600 text-xl" />}
          color="border-blue-600"
        />
        <StatCard
          title="Account Status"
          value={user?.isActive ? "Active" : "Inactive"}
          icon={<FaUser className="text-purple-600 text-xl" />}
          color="border-purple-600"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/add-property"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaPlus className="text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-800">Add Property</p>
              <p className="text-sm text-gray-600">List a new property for sale/rent</p>
            </div>
          </Link>
          <Link
            to="/create-blog"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaPlus className="text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-800">Create Blog</p>
              <p className="text-sm text-gray-600">Write and publish a new blog post</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">My Properties</h3>
        <Link
          to="/add-property"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Property
        </Link>
      </div>

      {propertiesLoading ? (
        <LoadingSpinner message="Loading properties..." />
      ) : properties?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.data.map((property) => (
            <div key={property._id} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">{property.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{property.location}</p>
              <p className="text-green-600 font-bold">₦{property.price?.toLocaleString()}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === "available" ? "bg-green-100 text-green-800" :
                  property.status === "sold" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {property.status}
                </span>
                <Link
                  to={`/properties/${property._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaHome className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">You haven't added any properties yet.</p>
          <Link
            to="/add-property"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  );

  const renderBlogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">My Blogs</h3>
        <Link
          to="/create-blog"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Create Blog
        </Link>
      </div>

      {blogsLoading ? (
        <LoadingSpinner message="Loading blogs..." />
      ) : blogs?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.data.map((blog) => (
            <div key={blog._id} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">{blog.title}</h4>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{blog.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>{blog.views} views</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  blog.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {blog.published ? "Published" : "Draft"}
                </span>
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Blog
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaBlog className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">You haven't created any blogs yet.</p>
          <Link
            to="/create-blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <p className="text-gray-900 capitalize">{user?.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <p className="text-gray-900">{user?.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
            <p className="text-gray-900">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-white text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: FaHome },
                  { id: "properties", label: "My Properties", icon: FaHome },
                  { id: "blogs", label: "My Blogs", icon: FaBlog },
                  { id: "profile", label: "Profile", icon: FaUser },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </button>
                ))}

                <hr className="my-4" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === "overview" && renderOverview()}
              {activeTab === "properties" && renderProperties()}
              {activeTab === "blogs" && renderBlogs()}
              {activeTab === "profile" && renderProfile()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;