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

const DecorativePagination = ({ currentPage, totalPages, onPageChange }) => {
  const displayTotalPages = Math.max(totalPages, 9);

  return (
    <div className="decorative-pag">
      <button
        className="pag-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {[1, 2, 3].map(i => i <= displayTotalPages && (
        <button
          key={i}
          className={`pag-num ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      ))}

      {displayTotalPages > 3 && (
        <>
          <span className="pag-dots">...</span>
          <button
            className={`pag-num ${displayTotalPages === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(displayTotalPages)}
          >
            {displayTotalPages}
          </button>
        </>
      )}

      <button
        className="pag-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  return (
    <div className="pagination">
      <button
        className="page-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {startPage > 1 && (
        <>
          <button className="page-num" onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span className="page-dots">...</span>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
        <button
          key={page}
          className={`page-num ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="page-dots">...</span>}
          <button className="page-num" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        className="page-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <DecorativePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default Gallery;