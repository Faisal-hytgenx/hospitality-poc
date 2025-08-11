'use client';

import { useState } from 'react';

export default function Filters({ filters, onFilterChange, onReset }) {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setActiveFilters({});
    onReset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</h3>
        
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {filter.label}:
            </label>
            {filter.type === 'select' ? (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type || 'text'}
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                placeholder={filter.placeholder}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        ))}
        
        <button
          onClick={handleReset}
          className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
