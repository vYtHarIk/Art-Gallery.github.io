function renderMobileMenu() {
  if (!state.isMenuOpen) return '';

  const artistDisplay = state.filters.artist || "Select the artist";
  const locationDisplay = state.filters.location || "Select the location";

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  return `
    <div class="filter-overlay" id="menuOverlay">
      <div class="filter-sidebar">
        <div class="filter-sidebar-header">
          <button class="close-filter" id="closeMenuBtn">✕</button>
        </div>
        
        <div class="filter-content">
          <div class="accordion-item active">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
              <span>ARTIST</span> <span class="toggle-icon"></span>
            </div>
            <div class="accordion-body">
              <div class="select-container">
                <div class="filter-select-trigger" onclick="toggleSelect(this)">
                  <span>${escapeHtml(artistDisplay)}</span>
                  <div class="arrow-icon"></div>
                </div>
                <div class="filter-options-list">
                  <div class="filter-option" onclick="selectArtist('')">All artists</div>
                  ${allArtists.map(artist => `
                    <div class="filter-option" onclick="selectArtist('${escapeHtml(artist)}')">${escapeHtml(artist)}</div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-item active">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
              <span>LOCATION</span> <span class="toggle-icon"></span>
            </div>
            <div class="accordion-body">
              <div class="select-container">
                <div class="filter-select-trigger" onclick="toggleSelect(this)">
                  <span>${escapeHtml(locationDisplay)}</span>
                  <div class="arrow-icon"></div>
                </div>
                <div class="filter-options-list">
                  <div class="filter-option" onclick="selectLocation('')">All locations</div>
                  ${allLocations.map(loc => `
                    <div class="filter-option" onclick="selectLocation('${escapeHtml(loc)}')">${escapeHtml(loc)}</div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-item active">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
              <span>YEARS</span> <span class="toggle-icon"></span>
            </div>
            <div class="accordion-body years-inputs">
              <input type="number" placeholder="From" value="${state.filters.yearFrom || ''}" 
                     oninput="app.setFilter('yearFrom', this.value)">
              <input type="number" placeholder="To" value="${state.filters.yearTo || ''}" 
                     oninput="app.setFilter('yearTo', this.value)">
            </div>
          </div>
        </div>

        <div class="filter-sidebar-footer">
          <button class="btn-show-results" id="show-results-mobile">SHOW THE RESULTS</button>
          <button class="btn-clear-filters" id="clear-filters-mobile">CLEAR</button>
        </div>
      </div>
    </div>
  `;
}

window.toggleSelect = function(element) {
  const container = element.closest('.select-container');
  if (!container) return;
  
  const isOpen = container.classList.contains('is-open');
  
  document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
  
  if (!isOpen) {
    container.classList.add('is-open');
  }
};

window.selectArtist = function(val) {
  state.filters.artist = val;
  document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
  if (window.app) window.app.applyFilters();
};

window.selectLocation = function(val) {
  state.filters.location = val;
  document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
  if (window.app) window.app.applyFilters();
};

document.addEventListener('click', function(e) {
  if (!e.target.closest('.select-container')) {
    document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
  }
});