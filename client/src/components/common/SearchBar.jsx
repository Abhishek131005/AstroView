import { useState } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  onClear,
  className = '',
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className={`w-4 h-4 transition-colors duration-200 ${
          isFocused ? 'text-electric-blue' : 'text-muted-gray'
        }`} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full bg-bg-tertiary border border-white/10 text-star-white pl-10 pr-10 py-2 rounded-lg transition-all duration-200 placeholder:text-faint-gray focus:border-electric-blue/50 focus:ring-2 focus:ring-electric-blue/20 focus:outline-none`}
        {...props}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-gray hover:text-star-white hover:bg-bg-secondary transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export { SearchBar };
