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

      function clearFilters() {
        currentFilters = {
          artist: '',
          location: '',
          yearFrom: '',
          yearTo: '',
          search: currentFilters.search
        };
        applyFilters();
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

      function renderPagination() {
        const totalPages = getTotalPages();
        if (totalPages <= 1) return '';
        
        let paginationHtml = '<div class="pagination">';
        
        paginationHtml += `<button class="pagination-btn" onclick="window.goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;
        
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
          paginationHtml += `<button class="pagination-btn" onclick="window.goToPage(1)">1</button>`;
          if (startPage > 2) paginationHtml += `<span class="pagination-dots">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
          paginationHtml += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="window.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) paginationHtml += `<span class="pagination-dots">...</span>`;
          paginationHtml += `<button class="pagination-btn" onclick="window.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        paginationHtml += `<button class="pagination-btn" onclick="window.goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
        
        paginationHtml += '</div>';
        return paginationHtml;
      }

      function render() {
        if (!appRoot) return;
        appRoot.innerHTML = `
          <div class="gallery-app">
            ${renderHeader()}
            ${renderSearchAndFilterBar()}
            ${renderMobileMenu()}
            ${renderGalleryGrid()}
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

      function renderMobileMenu() {
        if (!isMenuOpen) return '';
        return `
          <div class="mobile-menu-overlay" id="menuOverlay">
            <div class="mobile-menu">
              <div class="mobile-menu-header">
                <h3 class="caption-bold-12">FILTERS</h3>
                <button class="close-menu" id="closeMenuBtn">✕</button>
              </div>
              <div class="mobile-filters">
                <div class="filter-group-mobile">
                  <label class="filter-label caption-bold-12">ARTIST</label>
                  <div class="custom-select-mobile" data-filter="artist">
                    <div class="select-trigger-mobile para-light-14">${currentFilters.artist || 'Select the artist'}</div>
                    <div class="select-dropdown-mobile">
                      <div class="select-option-mobile" data-value="">All artists</div>
                      ${allArtists.map(artist => `<div class="select-option-mobile para-light-14" data-value="${escapeHtml(artist)}">${escapeHtml(artist)}</div>`).join('')}
                    </div>
                  </div>
                </div>
                <div class="filter-group-mobile">
                  <label class="filter-label caption-bold-12">LOCATION</label>
                  <div class="custom-select-mobile" data-filter="location">
                    <div class="select-trigger-mobile para-light-14">${currentFilters.location || 'Select the location'}</div>
                    <div class="select-dropdown-mobile">
                      <div class="select-option-mobile" data-value="">All locations</div>
                      ${allLocations.map(loc => `<div class="select-option-mobile para-light-14" data-value="${escapeHtml(loc)}">${escapeHtml(loc)}</div>`).join('')}
                    </div>
                  </div>
                </div>
                <div class="filter-group-mobile">
                  <label class="filter-label caption-bold-12">YEARS</label>
                  <div class="years-inputs-mobile">
                    <input type="number" class="year-input-mobile para-light-14" placeholder="From" id="year-from-mobile" value="${currentFilters.yearFrom}" min="1000" max="2030">
                    <span class="year-sep-mobile">—</span>
                    <input type="number" class="year-input-mobile para-light-14" placeholder="To" id="year-to-mobile" value="${currentFilters.yearTo}" min="1000" max="2030">
                  </div>
                </div>
              </div>
              <div class="mobile-menu-actions">
                <button class="btn-primary-mobile caption-bold-12" id="show-results-mobile">SHOW THE RESULTS</button>
                <button class="btn-secondary-mobile caption-bold-12" id="clear-filters-mobile">CLEAR</button>
              </div>
            </div>
          </div>
        `;
      }

      function renderGalleryGrid() {
        const paginatedPaintings = getPaginatedPaintings();
        const themeIcon = currentTheme === 'light' ? '<img src="img/pag-light.png">' : '<img src="img/pag.png">';
        
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
          <div class="pag">
              ${themeIcon}
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

        document.querySelectorAll('.custom-select-mobile').forEach(select => {
          const trigger = select.querySelector('.select-trigger-mobile');
          const dropdown = select.querySelector('.select-dropdown-mobile');
          const filterType = select.getAttribute('data-filter');
          
          if (trigger) {
            trigger.addEventListener('click', (e) => {
              e.stopPropagation();
              document.querySelectorAll('.select-dropdown-mobile.open').forEach(dd => {
                if (dd !== dropdown) dd.classList.remove('open');
              });
              dropdown.classList.toggle('open');
            });
          }
          
          dropdown.querySelectorAll('.select-option-mobile').forEach(opt => {
            opt.addEventListener('click', (e) => {
              const value = opt.getAttribute('data-value');
              if (filterType === 'artist') currentFilters.artist = value === 'All artists' ? '' : value;
              if (filterType === 'location') currentFilters.location = value === 'All locations' ? '' : value;
              trigger.innerText = value && value !== '' ? value : (filterType === 'artist' ? 'Select the artist' : 'Select the location');
              dropdown.classList.remove('open');
              applyFilters();
              e.stopPropagation();
            });
          });
        });

        const yearFromMobile = document.getElementById('year-from-mobile');
        const yearToMobile = document.getElementById('year-to-mobile');
        if (yearFromMobile) yearFromMobile.addEventListener('input', (e) => { currentFilters.yearFrom = e.target.value; applyFilters(); });
        if (yearToMobile) yearToMobile.addEventListener('input', (e) => { currentFilters.yearTo = e.target.value; applyFilters(); });

        const showBtnMobile = document.getElementById('show-results-mobile');
        const clearBtnMobile = document.getElementById('clear-filters-mobile');
        if (showBtnMobile) showBtnMobile.addEventListener('click', () => { toggleMenu(); applyFilters(); });
        if (clearBtnMobile) clearBtnMobile.addEventListener('click', () => {
          currentFilters = { artist: '', location: '', yearFrom: '', yearTo: '', search: currentFilters.search };
          if (searchInput) searchInput.value = currentFilters.search;
          applyFilters();
          toggleMenu();
        });

        document.addEventListener('click', function closeDropdowns(e) {
          if (!e.target.closest('.custom-select-mobile')) {
            document.querySelectorAll('.select-dropdown-mobile.open').forEach(dd => dd.classList.remove('open'));
          }
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