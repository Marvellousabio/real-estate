import { useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({
  value,
  duration = 2,
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
  separator = ","
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const motionValue = useMotionValue(0);

  // Format number with separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  useEffect(() => {
    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-counter="${value}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [value]);

  useEffect(() => {
    if (!isVisible) return;

    const timeoutId = setTimeout(() => {
      const controls = animate(motionValue, value, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });

      return controls.stop;
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [motionValue, value, duration, delay, isVisible]);

  return (
    <span
      data-counter={value}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`
      }}
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;