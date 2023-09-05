import React, { useState } from "react";

const AnimatedPlaceholderInput = ({
  label,
  value,
  onChange,
  name,
  color,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(value !== "");
  };

  return (
    <div className={`relative mb-4 ${isFocused ? "focused" : ""}`}>
      <label
        className={`absolute top-4 left-2 transition-all duration-300 font-mont ${
          isFocused || props.value
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
        onChange={onChange}
        name={name}
        className={`w-full p-3 border-[${color}] border rounded-lg outline-none font-mont ${
          isFocused ? `border-[${color}]` : "border-gray-300 bg-white"
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
