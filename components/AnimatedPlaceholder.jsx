import React, { useState, useEffect } from "react";

const AnimatedPlaceholderInput = ({
  label,
  value,
  onChange,
  name,
  color,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(Boolean(value));

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(Boolean(value));
  };

  const handleInputChange = (e) => {
    onChange(e);
    setHasContent(Boolean(e.target.value));
  };

  useEffect(() => {
    if (value) {
      setHasContent(true);
    }
  }, [value]);

  return (
    <div className={`relative mb-4 ${isFocused || hasContent ? "focused" : ""}`}>
      <label
        className={`absolute top-[12px] left-3 transition-all duration-300 font-mont ${
          isFocused || hasContent
            ? `text-[${color}] text-xs top-[-10px] bg-white`
            : "text-[14px] text-gray-500"
        }`}
        onClick={() => {
          document.querySelector(`input[name="${name}"]`).focus();
        }}
      >
        {label}
      </label>
      <input
        {...props}
        value={value}
        onChange={handleInputChange}
        name={name}
        className={`w-full p-3 border-[${color}] text-[14px] border rounded-lg outline-none font-mont ${
          isFocused || hasContent
            ? `border-[${color}]`
            : "border-gray-300 bg-white"
        } transition-all duration-300`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <style jsx>{`
        .relative.focused label {
          font-size: 10px;
          top: -8px;
          color: ${color};
        }
      `}</style>
    </div>
  );
};

export default AnimatedPlaceholderInput;
