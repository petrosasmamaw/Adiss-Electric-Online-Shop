import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axiosConfig';

export default function CategoryInput({ value, onChange, error }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback((query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/categories/search?q=${encodeURIComponent(query)}`);
        const results = (data.data || []).slice(0, 6);
        setSuggestions(results);
        setOpen(results.length > 0);
        setHighlightIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    fetchSuggestions(val);
  };

  const selectSuggestion = (cat) => {
    onChange(cat);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-md bg-white border font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150 ${
    error
      ? 'border-danger focus:border-danger'
      : 'border-border focus:border-amber focus:ring-2 focus:ring-amber/15'
  }`;

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
        className={inputClass}
        autoComplete="off"
      />
      {error && (
        <p className="text-danger text-[11px] mt-1 font-medium">{error}</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl overflow-hidden shadow-dropdown">
          {suggestions.map((cat, idx) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => selectSuggestion(cat)}
                className={`w-full text-left px-4 py-2.5 font-sans text-[13px] transition-colors duration-150 ${
                  idx === highlightIndex
                    ? 'bg-amber-tint text-amber2 font-semibold'
                    : 'text-ink hover:bg-smoke'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
