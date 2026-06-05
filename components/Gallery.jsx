import React from 'react';

const escapeHtml = (str) => {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 1) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 2) {
        pages.push('...');
      }
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  console.log('pageNumbers:', pageNumbers);

  return (
    <div className="pagination">
      <button className="page-arrow" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={`dots-${index}`} className="pag-dots">...</span>;
        }
        return (
          <button
            key={page}
            className={`page-num ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button className="page-arrow" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const Gallery = ({ paintings, currentPage, totalPages, onPageChange }) => {
  if (paintings.length === 0) {
    return (
      <div className="empty-gallery para-light-16">
        No paintings match your filters.<br />Try adjusting search or clear filters.
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {paintings.map(painting => (
          <div key={painting.id} className="art-card">
            <div className="card-image">
              <img src={painting.image} alt={escapeHtml(painting.title)} loading="lazy" />
            </div>
            <div className="card-content">
              <div className="content-flex-wrapper">
                <div className="text-container">
                  <div className="text-wrapper">
                    <div className="state-default">
                      <div className="painting-title">{escapeHtml(painting.title)}</div>
                      <div className="painting-year">{painting.year}</div>
                    </div>
                    <div className="state-hover">
                      <div className="painting-title uppercase">{escapeHtml(painting.artist)}</div>
                      <div className="painting-year uppercase">{escapeHtml(painting.location)}</div>
                    </div>
                  </div>
                </div>
                <div className="mobile-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </>
  );
};

export default Gallery;