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

  const filteredPaintings = paintings.filter(p => {
    if (filters.artist && p.artist !== filters.artist) return false;
    if (filters.location && p.location !== filters.location) return false;
    if (filters.yearFrom && p.year < parseInt(filters.yearFrom)) return false;
    if (filters.yearTo && p.year > parseInt(filters.yearTo)) return false;
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.artist.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
  const paginatedPaintings = filteredPaintings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('art_gallery_theme', newTheme);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ artist: '', location: '', yearFrom: '', yearTo: '', search: filters.search });
    setCurrentPage(1);
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
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default App;