import React, { useState, useRef, useEffect } from 'react';

const escapeHtml = (str) => {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
};

const SearchableSelect = ({ value, options, placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (selectedValue) => {
    onSelect(selectedValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  const displayValue = value || '';

  return (
    <div className="searchable-select" ref={containerRef} style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
      <div
        className={`searchable-trigger ${value ? 'has-value' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          background: 'var(--filter-select-bg)',
          border: '1px solid var(--filter-border)',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={value || placeholder}
          value={searchTerm}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          style={{
            flex: 1,
            padding: '14px 16px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: 'var(--filter-text)',
            cursor: 'pointer'
          }}
        />
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '0 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className="arrow-icon" style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--filter-text)',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} />
        </div>
      </div>

      {isOpen && (
        <div className="searchable-dropdown" style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--filter-select-bg)',
          border: '1px solid var(--filter-border)',
          borderRadius: '10px',
          zIndex: 1000,
          maxHeight: '280px',
          overflowY: 'auto',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Результаты поиска */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--filter-border)',
                  color: 'var(--filter-text)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--filter-border)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {opt}
              </div>
            ))
          ) : (
            <div style={{
              padding: '12px 16px',
              color: 'var(--filter-placeholder)',
              textAlign: 'center'
            }}>
              There are no matching results for your query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion-item ${isOpen ? 'active' : ''}`}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className="toggle-icon"></span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

const FilterMenu = ({ isOpen, onClose, filters, allArtists, allLocations, onUpdateFilter, onApplyFilters, onClearFilters }) => {
  const [localYearFrom, setLocalYearFrom] = useState(filters.yearFrom);
  const [localYearTo, setLocalYearTo] = useState(filters.yearTo);

  if (!isOpen) return null;

  const handleApply = () => {
    onUpdateFilter('yearFrom', localYearFrom);
    onUpdateFilter('yearTo', localYearTo);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setLocalYearFrom('');
    setLocalYearTo('');
    onClearFilters();
    onClose();
  };

  return (
    <div className="filter-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="filter-sidebar">
        <div className="filter-sidebar-header">
          <button className="close-filter" onClick={onClose}>✕</button>
        </div>

        <div className="filter-content">
          <AccordionSection title="ARTIST">
            <SearchableSelect
              value={filters.artist}
              options={allArtists}
              placeholder="Select the artist"
              onSelect={(val) => onUpdateFilter('artist', val)}
            />
          </AccordionSection>

          <AccordionSection title="LOCATION">
            <SearchableSelect
              value={filters.location}
              options={allLocations}
              placeholder="Select the location"
              onSelect={(val) => onUpdateFilter('location', val)}
            />
          </AccordionSection>

          <AccordionSection title="YEARS">
            <div className="years-inputs">
              <input
                type="number"
                placeholder="From"
                value={localYearFrom}
                onChange={(e) => setLocalYearFrom(e.target.value)}
              />
              <input
                type="number"
                placeholder="To"
                value={localYearTo}
                onChange={(e) => setLocalYearTo(e.target.value)}
              />
            </div>
          </AccordionSection>
        </div>

        <div className="filter-sidebar-footer">
          <button className="btn-show-results" onClick={handleApply}>SHOW THE RESULTS</button>
          <button className="btn-clear-filters" onClick={handleClear}>CLEAR</button>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;