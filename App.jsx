import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import Gallery from './components/Gallery';
import FilterMenu from './components/FilterMenu';
import { paintings, allArtists, allLocations } from './data';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('art_gallery_theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    artist: '',
    location: '',
    yearFrom: '',
    yearTo: '',
    search: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredPaintings = paintings.filter(painting => {
    if (filters.artist && painting.artist !== filters.artist) return false;
    
    if (filters.location && painting.location !== filters.location) return false;
    
    if (filters.yearFrom && painting.year < parseInt(filters.yearFrom)) return false;
    
    if (filters.yearTo && painting.year > parseInt(filters.yearTo)) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = painting.title.toLowerCase().includes(searchLower);
      const artistMatch = painting.artist.toLowerCase().includes(searchLower);
      if (!titleMatch && !artistMatch) return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
  const paginatedPaintings = filteredPaintings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const actualTotalPages = totalPages === 0 ? 1 : totalPages;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('art_gallery_theme', newTheme);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ artist: '', location: '', yearFrom: '', yearTo: '', search: '' });
  };

  const applyFilters = () => {
    setIsMenuOpen(false);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="gallery-app">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <SearchSection
        searchValue={filters.search}
        onSearchChange={(val) => updateFilter('search', val)}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        theme={theme}
      />
      <FilterMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        filters={filters}
        allArtists={allArtists}
        allLocations={allLocations}
        onUpdateFilter={updateFilter}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />
      <Gallery
        paintings={paginatedPaintings}
        currentPage={currentPage}
        totalPages={actualTotalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default App;