function render() {
  document.body.className = state.theme;
  
  root.innerHTML = `
    <div class="gallery-app">
      ${renderHeader()}
      ${renderSearchSection()} 
      ${renderMobileMenu()} 
      ${renderGallery()}
    </div>
  `;

  attachEventListeners();
}

function attachEventListeners() {
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      app.toggleMenu();
    });
  }

  const menuOverlay = document.getElementById('menuOverlay');
  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
        app.toggleMenu();
      }
    });
  }

  const showResultsBtn = document.getElementById('show-results-mobile');
  if (showResultsBtn) {
    showResultsBtn.addEventListener('click', () => {
      app.applyFilters();
    });
  }

  const clearFiltersBtn = document.getElementById('clear-filters-mobile');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      app.clearFilters();
    });
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.select-container')) {
      document.querySelectorAll('.select-container').forEach(el => el.classList.remove('is-open'));
    }
  });
}

window.app = {
  toggleTheme: () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('art_gallery_theme', state.theme);
    render();
  },
  toggleMenu: () => {
    state.isMenuOpen = !state.isMenuOpen;
    render();
  },
  updateSearch: (val) => {
    state.filters.search = val;
    render();
  },
  setFilter: (key, val) => {
    state.filters[key] = val;
    render();
  },
  applyFilters: () => {
    state.isMenuOpen = false;
    render();
  },
  clearFilters: () => {
    state.filters = { artist: '', location: '', yearFrom: '', yearTo: '', search: state.filters.search };
    state.isMenuOpen = false;
    render();
  }
};

render();