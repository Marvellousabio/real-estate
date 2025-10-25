import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  variant = 'text',
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300';

  const variants = {
    search: 'border-gray-300 focus:ring-[var(--accent)] focus:border-[var(--accent)]',
    text: 'border-gray-300 focus:ring-[var(--accent)] focus:border-[var(--accent)]'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={classes}
      {...props}
    />
  );
};

export default Input;