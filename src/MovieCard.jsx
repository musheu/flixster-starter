// Import CSS file to style the movie card layout and appearance
import './MovieCard.css';

// MovieCard is a React functional component that displays a single movie's information as a card
// It receives two props:
//   - movie: an object containing movie data (title, poster_path, vote_average, etc.)
//   - onClick: a function to handle click events when the user interacts with the card
function MovieCard({ movie, onClick }) {
  // Define the base URL for fetching poster images from TMDB
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  // Destructure relevant fields from the movie prop for easier access
  const { title, poster_path, vote_average } = movie;

  // Render the card UI for the movie
  return (
    // The root div represents the card, styled with the "movie-card" class
    // The onClick handler allows parent components to respond to card clicks (e.g., for showing details)
    <div className="movie-card" onClick={onClick}>
      {/* Display the movie poster image */}
      <img
        className="movie-poster" // Applies styling to the poster image
        src={`${imageBaseUrl}${poster_path}`} // Constructs the full image URL by combining the base and poster path
        alt={title ? `${title} Poster` : 'Movie Poster'} // Provides alt text for accessibility; uses the movie title if available
      />
      {/* Container for movie information below the poster */}
      <div className="movie-info">
        {/* Show the movie's title, styled appropriately */}
        <h2 className="movie-title">{title}</h2>
        {/* Show the movie's average rating, rounded to one decimal place for readability */}
        {/* The star emoji visually indicates this is a rating */}
        <p className="movie-rating">⭐ {vote_average.toFixed(1)}</p>
      </div>
    </div>
  );
}

// Export the MovieCard component to make it available for use in other parts of the app
export default MovieCard;