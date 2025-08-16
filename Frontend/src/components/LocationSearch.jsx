import React, { useState, useEffect, useRef } from 'react';
import 'remixicon/fonts/remixicon.css';

const LocationSearch = ({
  suggestions = [],
  setPickup,
  setDestination,
  activeField,
  setLocationSuggest,
  triggerRef,
  onSearch // New prop to handle API search
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    setFilteredSuggestions(suggestions);
    setIsVisible(true);

    // Position the popover relative to the trigger element
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate optimal position
      let top = rect.bottom + 8;
      let left = rect.left;
      let width = Math.min(rect.width, 400); // Max width of 400px

      // Check if popover would go below viewport
      if (top + 400 > viewportHeight) {
        top = rect.top - 400 - 8; // Position above the input
      }

      // Check if popover would go off the right edge
      if (left + width > viewportWidth) {
        left = Math.max(0, viewportWidth - width - 16);
      }

      // Check if popover would go off the left edge
      if (left < 0) {
        left = 16;
        width = Math.min(viewportWidth - 32, 400);
      }

      setPosition({ top, left, width });
    }
  }, [suggestions, triggerRef]);

  // Handle search with API call
  useEffect(() => {
    // Only search when suggestions change from parent, not on local search term changes
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  // Handle Enter key press for search
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && searchTerm && searchTerm.trim().length >= 2) {
      e.preventDefault();
      setIsSearching(true);
      setSearchCompleted(false);

      try {
        // Call the API search function passed from parent
        if (onSearch) {
          const result = await onSearch(searchTerm, activeField);
          if (result && result.success) {
            // Search completed successfully
            setSearchCompleted(true);
            // Hide success state after 2 seconds
            setTimeout(() => setSearchCompleted(false), 2000);
          } else {
            // Search failed
            console.error('Search failed:', result?.error);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        // Always reset loading state
        setIsSearching(false);
      }
    }
  };

  // Clear search term and reset suggestions when search term is cleared
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredSuggestions(suggestions);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target) &&
        triggerRef?.current && !triggerRef.current.contains(event.target)) {
        setLocationSuggest(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setLocationSuggest(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setLocationSuggest, triggerRef]);

  // Reposition popover on scroll or resize
  useEffect(() => {
    const handleReposition = () => {
      if (triggerRef?.current && isVisible) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate optimal position
        let top = rect.bottom + 8;
        let left = rect.left;
        let width = Math.min(rect.width, 400); // Max width of 400px

        // Check if popover would go below viewport
        if (top + 400 > viewportHeight) {
          top = rect.top - 400 - 8; // Position above the input
        }

        // Check if popover would go off the right edge
        if (left + width > viewportWidth) {
          left = Math.max(0, viewportWidth - width - 16);
        }

        // Check if popover would go off the left edge
        if (left < 0) {
          left = 16;
          width = Math.min(viewportWidth - 32, 400);
        }

        setPosition({ top, left, width });
      }
    };

    window.addEventListener('scroll', handleReposition);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition);
      window.removeEventListener('resize', handleReposition);
    };
  }, [triggerRef, isVisible]);

  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion);
    } else if (activeField === 'destination') {
      setDestination(suggestion);
    }
    setLocationSuggest(false);
  };

  const getLocationIcon = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();

    if (lowerSuggestion.includes('airport') || lowerSuggestion.includes('terminal')) {
      return 'ri-plane-line';
    } else if (lowerSuggestion.includes('bus') || lowerSuggestion.includes('station') || lowerSuggestion.includes('stop')) {
      return 'ri-bus-line';
    } else if (lowerSuggestion.includes('hospital') || lowerSuggestion.includes('clinic')) {
      return 'ri-heart-pulse-line';
    } else if (lowerSuggestion.includes('school') || lowerSuggestion.includes('college') || lowerSuggestion.includes('university')) {
      return 'ri-graduation-cap-line';
    } else if (lowerSuggestion.includes('mall') || lowerSuggestion.includes('shopping') || lowerSuggestion.includes('market')) {
      return 'ri-shopping-bag-line';
    } else if (lowerSuggestion.includes('restaurant') || lowerSuggestion.includes('cafe') || lowerSuggestion.includes('food')) {
      return 'ri-restaurant-line';
    } else if (lowerSuggestion.includes('hotel') || lowerSuggestion.includes('lodge')) {
      return 'ri-hotel-line';
    } else if (lowerSuggestion.includes('park') || lowerSuggestion.includes('garden')) {
      return 'ri-plant-line';
    } else if (lowerSuggestion.includes('office') || lowerSuggestion.includes('work')) {
      return 'ri-building-line';
    } else if (lowerSuggestion.includes('home') || lowerSuggestion.includes('house')) {
      return 'ri-home-line';
    } else {
      return 'ri-map-pin-line';
    }
  };

  const getLocationColor = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();

    if (lowerSuggestion.includes('airport') || lowerSuggestion.includes('terminal')) {
      return 'from-blue-500 to-cyan-500';
    } else if (lowerSuggestion.includes('bus') || lowerSuggestion.includes('station') || lowerSuggestion.includes('stop')) {
      return 'from-green-500 to-emerald-500';
    } else if (lowerSuggestion.includes('hospital') || lowerSuggestion.includes('clinic')) {
      return 'from-red-500 to-pink-500';
    } else if (lowerSuggestion.includes('school') || lowerSuggestion.includes('college') || lowerSuggestion.includes('university')) {
      return 'from-purple-500 to-indigo-500';
    } else if (lowerSuggestion.includes('mall') || lowerSuggestion.includes('shopping') || lowerSuggestion.includes('market')) {
      return 'from-yellow-500 to-orange-500';
    } else if (lowerSuggestion.includes('restaurant') || lowerSuggestion.includes('cafe') || lowerSuggestion.includes('food')) {
      return 'from-orange-500 to-red-500';
    } else if (lowerSuggestion.includes('hotel') || lowerSuggestion.includes('lodge')) {
      return 'from-indigo-500 to-purple-500';
    } else if (lowerSuggestion.includes('park') || lowerSuggestion.includes('garden')) {
      return 'from-green-500 to-teal-500';
    } else if (lowerSuggestion.includes('office') || lowerSuggestion.includes('work')) {
      return 'from-gray-500 to-slate-500';
    } else if (lowerSuggestion.includes('home') || lowerSuggestion.includes('house')) {
      return 'from-pink-500 to-rose-500';
    } else {
      return 'from-blue-500 to-indigo-500';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden animate-fadeIn"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxWidth: '400px'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="ri-map-pin-line text-blue-500"></i>
              {activeField === 'pickup' ? 'Pickup Location' : 'Destination'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeField === 'pickup' ? 'Where are you now?' : 'Where do you want to go?'}
            </p>
          </div>
          <button
            onClick={() => setLocationSuggest(false)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <i className="ri-close-line text-gray-500"></i>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="ri-search-line"></i>
          </div>
          <input
            type="text"
            placeholder={`Search ${activeField === 'pickup' ? 'pickup' : 'destination'} location...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-100"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-circle-fill"></i>
            </button>
          )}

          {/* Search Loader */}
          {isSearching && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Search Success Indicator */}
          {searchCompleted && !isSearching && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <i className="ri-check-line text-green-500 text-lg"></i>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="max-h-64 overflow-y-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-search-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              {isSearching ? 'Searching...' : searchTerm ? 'No locations found' : 'Start typing to search'}
            </p>
            <p className="text-gray-400 text-xs">
              {isSearching ? 'Please wait while we search...' : searchTerm ? 'Try searching with different keywords' : 'Type at least 2 characters to search for locations'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="group cursor-pointer p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 bg-gradient-to-br ${getLocationColor(suggestion)} rounded-lg flex items-center justify-center shadow-sm`}>
                    <i className={`${getLocationIcon(suggestion)} text-lg text-white`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                      {suggestion}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {activeField === 'pickup' ? 'Pickup location' : 'Destination'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-blue-500 text-sm"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="p-3 bg-yellow-50 border-t border-yellow-100">
        <p className="text-xs text-yellow-700 flex items-center gap-2">
          <i className="ri-lightbulb-line"></i>
          Tip: You can also type your exact address
        </p>
      </div>
    </div>
  );
};

export default LocationSearch;