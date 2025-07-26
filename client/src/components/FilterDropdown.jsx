import React, { useState } from "react";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "./ui/Button";

const FilterDropdown = ({
  type,
  options,
  currentValue,
  onFilterChange,
  label,
  min,
  max,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(currentValue);

  const handleApply = () => {
    onFilterChange(type, value);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultValue = type === "range" ? "daily" : type === "days" ? 30 : 5;
    setValue(defaultValue);
    onFilterChange(type, defaultValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-neutral-400 hover:text-white text-sm p-1 rounded-md hover:bg-neutral-900 transition-colors"
        title={`Filter ${label}`}
      >
        <FiFilter className="mr-1" />
        {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-neutral-950 border border-neutral-700 z-10">
          <div className="p-2">
            <h4 className="text-sm font-medium text-white mb-2">
              {label} Filter
            </h4>

            {options ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-white text-sm focus:outline-none mb-2"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-white text-sm focus:outline-none mb-2"
              />
            )}

            <div className="flex justify-between space-x-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center text-xs border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 text-white px-2 py-1 rounded"
              >
                <FiX className="mr-1" /> Reset
              </button>
              <Button
                onClick={handleApply}
                className="flex-1 text-xs px-2 py-1 rounded"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
