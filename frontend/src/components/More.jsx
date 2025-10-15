import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animate";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../services/api"; 
import { useQuery } from "@tanstack/react-query";

const More = () => {
  const navigate = useNavigate();

  // ✅ useQuery handles fetching, caching, retries
  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  const handlePostClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <section id="more" className="min-h-screen py-20 bg-[var(--light-gray)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
            Learn More <span className="text-[var(--accent)]">About Us</span>
          </h1>
          <p className="text-[var(--text-dark)] max-w-2xl mx-auto text-lg opacity-80">
            Explore our insights and expertise to understand why we’re the best
            choice for your real estate journey.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load blogs.</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">
            No blogs available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <motion.div
                key={post._id}
                variants={fadeIn("up", 0.2 + index * 0.1)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.3 }}
                className="relative group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                onClick={() => handlePostClick(post._id)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                <div className="p-6">
                  <p className="text-sm text-[var(--text-dark)] opacity-70 mb-2">
                    {post.createdAt ? new Date(post.createdAt).toDateString() : "No date"}
                  </p>

                  <h2 className="text-xl font-semibold text-[var(--primary)] mb-3 truncate">
                    {post.title}
                  </h2>
                  <p className="text-[var(--text-dark)] opacity-80 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post._id);
                    }}
                    className="mt-4 flex items-center text-[var(--secondary)] hover:text-[var(--accent)] font-semibold transition-colors duration-300"
                  >
                    Read More <MdArrowOutward className="ml-2 text-xl" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default More;
