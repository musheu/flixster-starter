// Import React dependencies and local components
import React, { useEffect, useState } from 'react'; // Hooks for side effects and state management
import MovieCard from './MovieCard'; // Component to render individual movie cards
import MovieModal from './MovieModal.jsx'; // Modal to show detailed movie info when a movie is selected
import './MovieList.css'; // Styles specific to the movie list component

// Main component that displays a list of movies based on search, sort, or category
const MovieList = ({ searchQuery, sortOption, category }) => {
  // State to hold the list of movies fetched from the API
  const [movies, setMovies] = useState([]);
  // State to track if the data is currently loading
  const [loading, setLoading] = useState(true);
  // State to hold any error message from the fetch operation
  const [error, setError] = useState(null);
  // State to track the current page number for pagination
  const [page, setPage] = useState(1);
  // State to indicate if there are more pages available from the API
  const [hasMore, setHasMore] = useState(true);
  // State to hold the currently selected movie for displaying in a modal
  const [selectedMovie, setSelectedMovie] = useState(null);

  // useEffect hook to fetch movies whenever page, searchQuery, sortOption, or category changes
  useEffect(() => {
    // Define an async function to fetch movie data from the API
    const fetchMovies = async () => {
      setLoading(true); // Indicate that loading has started
      setError(null); // Clear any previous errors

      try {
        const apiKey = import.meta.env.VITE_API_KEY; // Retrieve API key from environment variables
        let baseUrl;

        // Determine the API endpoint based on whether a search query is provided
        if (searchQuery) {
          // If there is a search query, use the search endpoint with the query and current page
          baseUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&query=${encodeURIComponent(searchQuery)}&page=${page}`;
        } else if (sortOption) {
          // If there is a sort option but no search query, use the discover endpoint with sorting and pagination
          baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&sort_by=${encodeURIComponent(sortOption)}&page=${page}`;
        } else {
          // If neither search nor sort is provided, fetch movies by category (e.g., popular, top_rated)
          baseUrl = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`;
        }

        // Fetch data from the constructed URL with the API key appended
        const response = await fetch(
          `${baseUrl}&api_key=${apiKey}`
        );

        // Check if the response is successful; if not, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch movie data');
        }

        // Parse the JSON response body
        const data = await response.json();

        // Update the movies state with the results from the API
        setMovies(data.results);
        // Update hasMore state to indicate if there are more pages available
        setHasMore(page < data.total_pages);
      } catch (err) {
        // If an error occurs during fetch, set the error message state
        setError(err.message);
      } finally {
        // Regardless of success or failure, set loading to false after fetch attempt
        setLoading(false);
      }
    };

    // Invoke the async fetch function
    fetchMovies();
  }, [page, searchQuery, sortOption, category]); // Dependencies that trigger this effect

  // Function to render pagination buttons dynamically based on current page and available pages
  const renderPageButtons = () => {
    const buttons = []; // Array to hold the JSX buttons
    // Calculate the starting page for the current group of 5 pages
    const startPage = Math.max(1, page - ((page - 1) % 5));
    // Calculate the ending page for the current group (5 pages per group)
    const endPage = startPage + 4;

    // If the start page is greater than 1, add a previous button to go to the previous group
    if (startPage > 1) {
      buttons.push(
        <button key="prev" onClick={() => setPage(startPage - 1)}>
          &lt; {/* Left arrow symbol */}
        </button>
      );
      // If the start page is beyond the first group, also add a button to jump to the first page
      if (startPage > 5) {
        buttons.push(
          <button key="first" onClick={() => setPage(1)}>
            1.. {/* Indicating jump to first page */}
          </button>
        );
      }
    }

    // Loop through the pages in the current group and create buttons for each
    for (let i = startPage; i <= endPage && i <= 500; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)} // Set the page state to the clicked page number
          disabled={i === page} // Disable the button for the current page
        >
          {i} {/* Display the page number */}
        </button>
      );
    }

    // If there are more pages after the current group, add a next button to go forward
    if (hasMore && endPage < 500) {
      buttons.push(
        <button key="next" onClick={() => setPage(endPage + 1)}>
          &gt; {/* Right arrow symbol */}
        </button>
      );
    }

    // Return the array of pagination buttons to be rendered
    return buttons;
  };

  // Render the component's JSX
  return (
    <>
      {/* Container div for the list of movies */}
      <div className="movie-list">
        {loading ? (
          // If loading is true, show a loading message
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          // If not loading and no movies found, show a no movies message
          <p>No movies available.</p>
        ) : (
          // Otherwise, map through movies and render a MovieCard for each with a poster image
          movies
            .filter((movie) => movie.poster_path) // Only show movies with a poster available
            .map((movie) => (
              <MovieCard
                key={movie.id} // Unique key for React list rendering
                movie={movie} // Pass movie data as prop
                onClick={() => setSelectedMovie(movie)} // Set selected movie on click to open modal
              />
            ))
        )}
      </div>

      {/* Conditional rendering of the MovieModal if a movie is selected */}
      {selectedMovie && (
        <MovieModal
          movieId={selectedMovie.id} // Pass the selected movie's ID to fetch detailed info
          onClose={() => setSelectedMovie(null)} // Function to close the modal and clear selection
        />
      )}

      {/* Render pagination buttons only when not loading */}
      {!loading && (
        <div className="pagination" id="pagination">
          {renderPageButtons()} {/* Render dynamically generated pagination buttons */}
        </div>
      )}

      {/* Show a message when there are no more movies to display */}
      {!hasMore && <p style={{ textAlign: 'center' }}>No more movies to show.</p>}
    </>
  );
};

// Export the MovieList component as the default export
export default MovieList;