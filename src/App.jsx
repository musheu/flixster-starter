// Main App component for Flixster movie app
// Manages state for search, sorting, category selection, and navbar visibility
// Renders header with logo and navigation, search and sort controls, movie list, and footer

// Import React's useState hook for managing component state
import { useState } from 'react'
// Import the main CSS file for global styles
import './App.css'
// Import MovieList component to display the list of movies
import MovieList from './MovieList.jsx'
// Import theater masks image for the header logo
import masks from './assets/masks.png';

const App = () => {
  // State to toggle visibility of the menu (not currently used)
  const [showMenu, setShowMenu] = useState(false);
  // State to toggle visibility of the navbar
  const [showNavbar, setShowNavbar] = useState(false);
  // State to hold the final search query used for fetching movies
  const [searchQuery, setSearchQuery] = useState('');
  // Temporary state to hold the search input value before submitting
  const [tempSearch, setTempSearch] = useState('');
  // State to hold the selected sorting option for movie list
  const [sortOption, setSortOption] = useState('');
  // State to hold the currently selected movie category
  const [category, setCategory] = useState('popular');

  // Debug log to track current sort option
  console.log('sortOTION', sortOption)

  // Handler for submitting the search form; sets the searchQuery state
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form submit behavior (page reload)
    setSearchQuery(tempSearch.trim()); // Update searchQuery with trimmed tempSearch value
  };

  // Handler to clear the search input and reset searchQuery
  const handleClearSearch = () => {
    setSearchQuery(''); // Clear the active search query
    setTempSearch(''); // Clear the temporary search input
  };

  // Handler for updating temporary search input as user types
  const handleInputChange = (e) => {
    const value = e.target.value; // Get current input value
    // Store value in a temporary state instead of searchQuery to delay search
    setTempSearch(value);
  };

  // Handler to update sorting option when user selects a new sort from dropdown
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handler to change movie category when user clicks category buttons
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
 
    <div className="App">
      {/* Header section containing logo and navigation */}
      <div className="theater-header">
        {/* Logo button toggles visibility of navbar */}
        <button className="header-logo" onClick={() => setShowNavbar(!showNavbar)}>
          <img src={masks} alt="Theater Logo" />
        </button>
        {/* Navbar container; shows or hides based on showNavbar state */}
         <div className={`navbar ${showNavbar ? 'show' : ''}`}>
          {/* Left side navigation buttons for selecting movie category */}
          <div className="navbar-left">
            <button onClick={() => setCategory('now_playing')}>Now Playing</button>
            <button onClick={() => setCategory('upcoming')}>Coming Soon</button>
            <button onClick={() => setCategory('popular')}>Popular</button>
            <button onClick={() => setCategory('top_rated')}>Top Rated</button>
          </div>
          {/* Right side contains search form and sort dropdown */}
          <div className="navbar-right">
            {/* Search form with input and buttons */}
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search movies..."
                value={tempSearch} // Controlled input bound to tempSearch state
                onChange={handleInputChange} // Update tempSearch on input change
                className="search-input"
              />
              {/* Submit button triggers search */}
              <button type="submit" className="search-button">Search</button>
              {/* Clear button only shown if there is an active searchQuery */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch} // Clears search input and query
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </form>
            {/* Dropdown to select sorting option */}
            <select value={sortOption} onChange={handleSortChange} className="sort-dropdown">
              <option value="">-- Sort By --</option>
              <option value="original_title.asc">Title (A-Z)</option>
              <option value="release_date.desc">Release Date (Newest)</option>
              <option value="vote_average.desc">Vote Average (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
    
      {/* Decorative curtains on left and right sides */}
      <div className="curtain left-curtain "></div>
      <div className="curtain right-curtain"></div>
      {/* MovieList component renders movies based on current search, sort, and category */}
      <MovieList searchQuery={searchQuery} sortOption={sortOption} category={category} />
      {/* Footer section with copyright info */}
      <footer className="app-footer">
        <p>&copy; 2025 Musheu's Flixster. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Export App component as default export for use in index.js
export default App;
