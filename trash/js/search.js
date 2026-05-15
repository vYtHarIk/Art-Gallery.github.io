function renderSearchSection() {
  const filterIcon = state.theme === 'light' ? 'filter_icon-red.png' : 'filter_icon.png';
  
  return `
    <div class="search-filter-section">
      <div class="search-filter-container">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="22" y1="22" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="search-input" placeholder="Painting title" 
                 value="${state.filters.search}" oninput="app.updateSearch(this.value)">
        </div>
        <button class="burger-btn" onclick="app.toggleMenu()">
          <img src="img/${filterIcon}" class="burger-icon">
        </button>
      </div>
    </div>
    ${state.isMenuOpen ? renderFilterMenu() : ''}
  `;
}

function renderFilterMenu() {
  return `
    <div class="filter-overlay" onclick="if(event.target === this) app.toggleMenu()">
      <div class="filter-sidebar">
        <div class="filter-sidebar-header">
          <button class="close-filter" onclick="app.toggleMenu()">✕</button>
        </div>
        <div class="filter-content">
          ${renderAccordion('ARTIST', allArtists, 'artist')}
          ${renderAccordion('LOCATION', allLocations, 'location')}
        </div>
        <div class="filter-sidebar-footer">
          <button class="btn-show-results" onclick="app.toggleMenu()">SHOW THE RESULTS</button>
          <button class="btn-clear-filters" onclick="app.clearFilters()">CLEAR</button>
        </div>
      </div>
    </div>
  `;
}

function renderAccordion(title, options, type) {
  const current = state.filters[type] || `Select the ${type}`;
  return `
    <div class="accordion-item active">
      <div class="accordion-header"><span>${title}</span></div>
      <div class="accordion-body" style="max-height: 300px;">
        <div class="select-container">
          <div class="filter-select-trigger" onclick="this.parentElement.classList.toggle('is-open')">
            <span>${current}</span>
            <div class="arrow-icon"></div>
          </div>
          <div class="filter-options-list">
            <div class="filter-option" onclick="app.setFilter('${type}', '')">All</div>
            ${options.map(opt => `<div class="filter-option" onclick="app.setFilter('${type}', '${opt}')">${opt}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}