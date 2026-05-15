function renderGallery() {
  let filtered = paintings;
  
  if (state.filters.artist) {
    filtered = filtered.filter(p => p.artist === state.filters.artist);
  }
  
  if (state.filters.location) {
    filtered = filtered.filter(p => p.location === state.filters.location);
  }
  
  if (state.filters.yearFrom) {
    filtered = filtered.filter(p => p.year >= parseInt(state.filters.yearFrom));
  }
  if (state.filters.yearTo) {
    filtered = filtered.filter(p => p.year <= parseInt(state.filters.yearTo));
  }
  
  if (state.filters.search) {
    const searchLower = state.filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) || 
      p.artist.toLowerCase().includes(searchLower)
    );
  }
  
  const itemsPerPage = 6;
  const startIndex = (state.currentPage - 1) * itemsPerPage;
  const paginatedPaintings = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  
  if (paginatedPaintings.length === 0) {
    return `<div class="empty-gallery para-light-16">
      No paintings match your filters.<br>Try adjusting search or clear filters.
    </div>`;
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
    ${renderPagination(totalPages)}
  `;
}

function renderPagination(totalPages) {
  if (totalPages <= 1) return '';
  
  const currentPage = state.currentPage;
  
  let paginationHtml = '<div class="pagination">';
  
  paginationHtml += `
    <button class="page-arrow" onclick="window.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
  `;
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  if (startPage > 1) {
    paginationHtml += `<button class="page-num" onclick="window.changePage(1)">1</button>`;
    if (startPage > 2) {
      paginationHtml += `<span class="page-dots">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `
      <button class="page-num ${i === currentPage ? 'active' : ''}" onclick="window.changePage(${i})">
        ${i}
      </button>
    `;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHtml += `<span class="page-dots">...</span>`;
    }
    paginationHtml += `<button class="page-num" onclick="window.changePage(${totalPages})">${totalPages}</button>`;
  }
  
  paginationHtml += `
    <button class="page-arrow" onclick="window.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  `;
  
  paginationHtml += '</div>';
  
  paginationHtml += `
    <div class="decorative-pag">
      <button class="pag-arrow" onclick="window.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="pag-num ${currentPage === 1 ? 'active' : ''}" onclick="window.changePage(1)">1</button>
      <button class="pag-num ${currentPage === 2 ? 'active' : ''}" onclick="window.changePage(2)">2</button>
      <button class="pag-num ${currentPage === 3 ? 'active' : ''}" onclick="window.changePage(3)">3</button>
      <span class="pag-dots">...</span>
      <button class="pag-num ${currentPage === 9 ? 'active' : ''}" onclick="window.changePage(9)">9</button>
      <button class="pag-arrow" onclick="window.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  `;
  
  return paginationHtml;
}

window.changePage = function(page) {
  if (page < 1) return;
  const filteredCount = getFilteredCount();
  const totalPages = Math.ceil(filteredCount / 6);
  if (page > totalPages) return;
  state.currentPage = page;
  if (window.app) window.app.render();
};

function getFilteredCount() {
  let filtered = paintings;
  
  if (state.filters.artist) {
    filtered = filtered.filter(p => p.artist === state.filters.artist);
  }
  if (state.filters.location) {
    filtered = filtered.filter(p => p.location === state.filters.location);
  }
  if (state.filters.yearFrom) {
    filtered = filtered.filter(p => p.year >= parseInt(state.filters.yearFrom));
  }
  if (state.filters.yearTo) {
    filtered = filtered.filter(p => p.year <= parseInt(state.filters.yearTo));
  }
  if (state.filters.search) {
    const searchLower = state.filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) || 
      p.artist.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered.length;
}