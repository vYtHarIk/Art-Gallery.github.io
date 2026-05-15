import React, { useState } from 'react';

const escapeHtml = (str) => {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
};

const CustomSelect = ({ value, options, placeholder, onSelect, allLabel = "All" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue = value || placeholder;

  return (
    <div className="select-container" style={{ position: 'relative' }}>
      <div
        className={`filter-select-trigger ${value ? 'active-selected' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{escapeHtml(displayValue)}</span>
        <div className="arrow-icon"></div>
      </div>
      {isOpen && (
        <div className="filter-options-list" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}>
          <div className="filter-option" onClick={() => { onSelect(''); setIsOpen(false); }}>
            {allLabel}
          </div>
          {options.map(opt => (
            <div
              key={opt}
              className="filter-option"
              onClick={() => { onSelect(opt); setIsOpen(false); }}
            >
              {escapeHtml(opt)}
            </div>
          ))}
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
            {/* <CustomSelect
              value={filters.artist}
              options={allArtists}
              placeholder="Select the artist"
              onSelect={(val) => onUpdateFilter('artist', val)}
            /> */}
          </AccordionSection>

          <AccordionSection title="LOCATION">
            {/* <CustomSelect
              value={filters.location}
              options={allLocations}
              placeholder="Select the location"
              onSelect={(val) => onUpdateFilter('location', val)}
            /> */}
          </AccordionSection>

          <AccordionSection title="YEARS">
            {/* <div className="years-inputs">
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
            </div> */}
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