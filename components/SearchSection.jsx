import React from 'react';

const SearchSection = ({ searchValue, onSearchChange, onMenuToggle, theme }) => {
  const filterIcon = theme === 'light' ? 'filter_icon-red.png' : 'filter_icon.png';

  return (
    <div className="search-filter-section">
      <div className="search-filter-container">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="22" y1="22" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Painting title"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="burger-btn" onClick={onMenuToggle}>
          <img src={`img/${filterIcon}`} className="burger-icon" alt="filter" />
        </button>
      </div>
    </div>
  );
};

export default SearchSection;