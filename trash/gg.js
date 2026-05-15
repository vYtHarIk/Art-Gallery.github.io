(function() {
  const paintings = [
    { id: 1, title: "CASCATE DI TIVOLI", year: 1761, artist: "Giovanni Battista Piranesi", location: "Tivoli", image: "img/image 1.png" },
    { id: 2, title: "PORTRAIT OF VINCENT VAN GOGH", year: 1886, artist: "Vincent van Gogh", location: "Paris", image: "img/image 2.png" },
    { id: 3, title: "UNEQUAL MARRIAGE", year: 1862, artist: "Vasily Pukirev", location: "Moscow", image: "img/image 3.png" },
    { id: 4, title: "THE HAPPY VIOLINIST", year: 1624, artist: "Gerard van Honthorst", location: "Amsterdam", image: "img/image 4.png" },
    { id: 5, title: "THE ARCADIAN", year: 1834, artist: "Thomas Cole", location: "New York", image: "img/image 5.png" },
    { id: 6, title: "GOLFO DI NAPOLI", year: 1845, artist: "Anton Sminck van Pitloo", location: "Naples", image: "img/image 6.png" },
  ];

  const allArtists = [...new Set(paintings.map(p => p.artist))];
  const allLocations = [...new Set(paintings.map(p => p.location))];

  let currentTheme = 'light';
  let isMenuOpen = false;
  let currentFilters = {
    artist: '',
    location: '',
    yearFrom: '',
    yearTo: '',
    search: ''
  };
  let filteredPaintings = [...paintings];
  
  let currentPage = 1;
  const itemsPerPage = 6;

  const appRoot = document.getElementById('root');

  function filterPaintings(artist, location, yearFrom, yearTo, searchQuery) {
    return paintings.filter(p => {
      if (artist && p.artist !== artist) return false;
      if (location && p.location !== location) return false;
      if (yearFrom && p.year < parseInt(yearFrom)) return false;
      if (yearTo && p.year > parseInt(yearTo)) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !p.artist.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (currentTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('art_gallery_theme', currentTheme);
    render();
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    render();
  }

  function applyFilters() {
    filteredPaintings = filterPaintings(
      currentFilters.artist,
      currentFilters.location,
      currentFilters.yearFrom,
      currentFilters.yearTo,
      currentFilters.search
    );
    currentPage = 1;
    render();
  }

  function getSearchSuggestions() {
    const query = currentFilters.search.toLowerCase();
    if (!query || query.length < 1) return '';
    const matches = paintings.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.artist.toLowerCase().includes(query)
    ).slice(0, 4);
    if (matches.length === 0) return '<div class="suggestion-item">No matches for Lorem</div>';
    return matches.map(p => `<div class="suggestion-item" data-suggest="${escapeHtml(p.title)}">${escapeHtml(p.title)} (${p.year})</div>`).join('');
  }

  function getPaginatedPaintings() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPaintings.slice(startIndex, endIndex);
  }

  function getTotalPages() {
    return Math.ceil(filteredPaintings.length / itemsPerPage);
  }

  function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    render();
  }

  function render() {
    if (!appRoot) return;
    appRoot.innerHTML = `
      <div class="gallery-app">
        ${renderHeader()}
        ${renderSearchAndFilterBar()}
        ${renderMobileMenu()}
        ${renderGalleryGrid()}
        ${renderDecorativePag()}
        ${renderPagination()}
      </div>
    `;
    attachEventListeners();
  }

  function renderHeader() {
    const themeIcon = currentTheme === 'light' ? '<img src="img/dark_icon.png" style="width:20px;height:20px;">' : '<img src="img/icon_btn.png" style="width:20px;height:20px;">';
    return `
      <header class="header">
        <div class="header-container">
          <h1 class="logo h1"></h1>
          <button class="theme-toggle" id="themeToggleBtn" aria-label="Toggle theme">${themeIcon}</button>
        </div>
      </header>
    `;
  }

  function renderSearchAndFilterBar() {
    const themeIcon = currentTheme === 'light' ? '<img src="img/filter_icon-red.png">' : '<img src="img/filter_icon.png">';
    return `
      <div class="search-filter-section">
        <div class="search-filter-container">
          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="22" y1="22" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="search-input" placeholder="Painting title" value="${escapeHtml(currentFilters.search)}" id="global-search">
            ${currentFilters.search ? `<div class="search-suggestions">${getSearchSuggestions()}</div>` : ''}
          </div>
          <button class="burger-btn" id="burgerMenuBtn" aria-label="Menu">${themeIcon}</button>
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
      currentFilters.artist = val;
      document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
      applyFilters();
  };

  window.selectLocation = function(val) {
      currentFilters.location = val;
      document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
      applyFilters();
  };

  document.addEventListener('click', function(e) {
      if (!e.target.closest('.select-container')) {
          document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
      }
  });

  function renderMobileMenu() {
      if (!isMenuOpen) return '';

      const artistDisplay = currentFilters.artist || "Select the artist";
      const locationDisplay = currentFilters.location || "Select the location";

      return `
        <div class="filter-overlay" id="menuOverlay">
          <div class="filter-sidebar">
            <div class="filter-sidebar-header">
              <button class="close-filter" id="closeMenuBtn">✕</button>
            </div>
            
            <div class="filter-content">
              <div class="accordion-item">
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                  <span>ARTIST</span> <span class="toggle-icon"></span>
                </div>
                <div class="accordion-body">
                  <div class="select-container">
                    <div class="filter-select-trigger ${currentFilters.artist ? 'active-selected' : ''}" onclick="toggleSelect(this)">
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

              <div class="accordion-item">
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                  <span>LOCATION</span> <span class="toggle-icon"></span>
                </div>
                <div class="accordion-body">
                  <div class="select-container">
                      <div class="filter-select-trigger ${currentFilters.location ? 'active-selected' : ''}" onclick="toggleSelect(this)">
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

              <div class="accordion-item">
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                  <span>YEARS</span> <span class="toggle-icon"></span>
                </div>
                <div class="accordion-body years-inputs">
                  <input type="number" placeholder="From" value="${currentFilters.yearFrom}" oninput="currentFilters.yearFrom = this.value">
                  <input type="number" placeholder="To" value="${currentFilters.yearTo}" oninput="currentFilters.yearTo = this.value">
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

  // ДЕКОРАТИВНЫЙ PAG - всегда показывает "1 2 3 ... 9"
  function renderDecorativePag() {
    const totalPages = getTotalPages();
    
    // Если всего 1 страница, но нам нужно показать декоративные номера
    // Используем фиксированное количество страниц для демонстрации
    const displayTotalPages = Math.max(totalPages, 9); // Показываем до 9 страниц для красоты
    
    let pagHtml = '<div class="decorative-pag">';
    
    // Стрелка влево
    pagHtml += `
      <button class="pag-arrow" onclick="window.goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    `;
    
    // Показываем номера страниц в формате "1 2 3 ... 9"
    // Всегда показываем первые 3 страницы
    for (let i = 1; i <= Math.min(3, displayTotalPages); i++) {
      pagHtml += `<button class="pag-num ${i === currentPage ? 'active' : ''}" onclick="window.goToPage(${i})">${i}</button>`;
    }
    
    // Если страниц больше 3, показываем троеточие и последнюю страницу
    if (displayTotalPages > 3) {
      pagHtml += `<span class="pag-dots">...</span>`;
      pagHtml += `<button class="pag-num ${displayTotalPages === currentPage ? 'active' : ''}" onclick="window.goToPage(${displayTotalPages})">${displayTotalPages}</button>`;
    }
    
    // Стрелка вправо
    pagHtml += `
      <button class="pag-arrow" onclick="window.goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    `;
    
    pagHtml += '</div>';
    return pagHtml;
  }

  function renderPagination() {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return '';
    
    let paginationHtml = '<div class="pagination">';
    
    paginationHtml += `
      <button class="page-arrow" onclick="window.goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>`;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
      paginationHtml += `<button class="page-num" onclick="window.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHtml += `<span class="page-dots">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<button class="page-num ${i === currentPage ? 'active' : ''}" onclick="window.goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHtml += `<span class="page-dots">...</span>`;
      }
      paginationHtml += `<button class="page-num" onclick="window.goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    paginationHtml += `
      <button class="page-arrow" onclick="window.goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>`;
    
    paginationHtml += '</div>';
    return paginationHtml;
  }

  function renderGalleryGrid() {
    const paginatedPaintings = getPaginatedPaintings();
    
    if (paginatedPaintings.length === 0) {
      return `<div class="empty-gallery para-light-16">No paintings match your filters.<br>Try adjusting search or clear filters.</div>`;
    }
    return `
      <div class="gallery-grid">
        ${paginatedPaintings.map(painting => `
          <div class="art-card">
              <div class="card-image">
                <img src="${painting.image}" alt="${escapeHtml(painting.title)}" loading="lazy">
              </div>
              <div class="card-content">
                <div class="content-flex-wrapper">
                  <div class="text-container">
                    <div class="text-wrapper">
                      <div class="state-default">
                        <div class="painting-title">${escapeHtml(painting.title)}</div>
                        <div class="painting-year">${painting.year}</div>
                      </div>
                      <div class="state-hover">
                        <div class="painting-title uppercase">${escapeHtml(painting.artist)}</div>
                        <div class="painting-year uppercase">${escapeHtml(painting.location)}</div>
                      </div>
                    </div>
                  </div>
                  <div class="mobile-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
        `).join('')}
      </div>
    `;
  }

  function attachEventListeners() {
    const burgerBtn = document.getElementById('burgerMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const themeBtn = document.getElementById('themeToggleBtn');
    const searchInput = document.getElementById('global-search');

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) toggleMenu(); });
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        applyFilters();
      });
    }

    document.querySelectorAll('.suggestion-item[data-suggest]').forEach(el => {
      el.addEventListener('click', () => {
        const suggested = el.getAttribute('data-suggest');
        if (suggested && searchInput) {
          searchInput.value = suggested;
          currentFilters.search = suggested;
          applyFilters();
        }
      });
    });

    const showBtnMobile = document.getElementById('show-results-mobile');
    const clearBtnMobile = document.getElementById('clear-filters-mobile');
    if (showBtnMobile) showBtnMobile.addEventListener('click', () => { toggleMenu(); applyFilters(); });
    if (clearBtnMobile) clearBtnMobile.addEventListener('click', () => {
      currentFilters = { artist: '', location: '', yearFrom: '', yearTo: '', search: currentFilters.search };
      if (searchInput) searchInput.value = currentFilters.search;
      applyFilters();
      toggleMenu();
    });
  }

  window.goToPage = goToPage;

  const savedTheme = localStorage.getItem('art_gallery_theme');
  if (savedTheme === 'dark') {
    currentTheme = 'dark';
    document.body.classList.add('dark');
  } else {
    currentTheme = 'light';
    document.body.classList.remove('dark');
  }

  render();
})();

window.selectArtist = (val) => { currentFilters.artist = val; applyFilters(); };
window.selectLocation = (val) => { currentFilters.location = val; applyFilters(); };