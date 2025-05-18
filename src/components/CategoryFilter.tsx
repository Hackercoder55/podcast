import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Tag } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-gray-800/50 
                 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-700/50 
                 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
      >
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          <span className="truncate">
            {selectedCategory || 'All Categories'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl 
                      z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 
                      scrollbar-track-gray-900">
          <div className="py-1">
            <button
              onClick={() => {
                setSelectedCategory('');
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 
                        ${!selectedCategory ? 'bg-purple-900/30 text-purple-300' : 'text-gray-200'}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700
                          ${selectedCategory === category ? 'bg-purple-900/30 text-purple-300' : 'text-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;