import React, { useState, useEffect } from "react";
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";

function Index() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [recommendedEpisodes, setRecommendedEpisodes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    document.title = "Home - Recommendations";
    document.body.classList.add("index");
    return function cleanup() {
      document.body.classList.remove("index");
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      // Fetch recommended movies
      axios.get(`http://127.0.0.1:8002/recommended-movies/?user_id=${user.id}`)
        .then(response => {
          const movieIds = response.data;
          console.log("Recommended movie IDs:", movieIds); // Log the movie IDs
          if (movieIds.length > 0) {
            return Promise.all(movieIds.map(id => axios.get(`http://127.0.0.1:8000/movies/${id}/`)));
          } else {
            setRecommendedMovies([]);
          }
        })
        .then(responses => {
          if (responses) {
            const movies = responses.map(response => response.data);
            setRecommendedMovies(movies);
          }
        })
        .catch(error => console.error("Error fetching recommended movies:", error));

      // Fetch recommended series
      axios.get(`http://127.0.0.1:8002/recommended-series/?user_id=${user.id}`)
        .then(response => {
          const seriesIds = response.data;
          console.log("Recommended series IDs:", seriesIds); // Log the series IDs
          if (seriesIds.length > 0) {
            return Promise.all(seriesIds.map(id => axios.get(`http://127.0.0.1:8000/series/${id}/`)));
          } else {
            setRecommendedSeries([]);
          }
        })
        .then(responses => {
          if (responses) {
            const series = responses.map(response => response.data);
            setRecommendedSeries(series);
          }
        })
        .catch(error => console.error("Error fetching recommended series:", error));

      // Fetch recommended episodes
      axios.get(`http://127.0.0.1:8002/recommended-episodes/?user_id=${user.id}`)
        .then(response => {
          const episodeIds = response.data;
          console.log("Recommended episode IDs:", episodeIds); // Log the episode IDs
          if (episodeIds.length > 0) {
            return Promise.all(episodeIds.map(id => axios.get(`http://127.0.0.1:8000/episodes/${id}/`)));
          } else {
            setRecommendedEpisodes([]);
          }
        })
        .then(responses => {
          if (responses) {
            const episodes = responses.map(response => response.data);
            setRecommendedEpisodes(episodes);
          }
        })
        .catch(error => console.error("Error fetching recommended episodes:", error));
    }

    axios.get('http://127.0.0.1:8000/genres/')
      .then(response => setGenres(response.data))
      .catch(error => console.error("Error fetching genres:", error));

    axios.get('http://127.0.0.1:8000/series/')
      .then(response => setSeries(response.data))
      .catch(error => console.error('Error fetching series:', error));
  }, []);

  const getGenreNames = (genreIds) => {
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : "Unknown";
    }).join(', ');
  };

  const getSeriesTitle = (seriesId) => {
    const serie = series.find(s => s.id === seriesId);
    return serie ? serie.title : 'Unknown';
  };

  const renderMovie = (movie) => (
    <div key={movie.id} className="series-card">
      <h3>{movie.title}</h3>
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Directors:</strong> {movie.directors}</p>
      <p><strong>Duration:</strong> {movie.duration}</p>
      <p><strong>Genres:</strong> {getGenreNames(movie.genre_ids)}</p>
      <p><strong>Main Actors:</strong> {movie.main_actors}</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Thumbnail:</strong> <a href={movie.thumbnail_url} target="_blank" rel="noopener noreferrer">View Thumbnail</a></p>
    </div>
  );

  const renderSerie = (serie) => (
    <div key={serie.id} className="series-card">
      <h3>{serie.title}</h3>
      <p><strong>Description:</strong> {serie.description}</p>
      <p><strong>Directors:</strong> {serie.directors}</p>
      <p><strong>Average Episode Duration:</strong> {serie.episode_average_duration ? serie.episode_average_duration + ' minutes' : 'N/A'}</p>
      <p><strong>Genres:</strong> {getGenreNames(serie.genre_ids)}</p>
      <p><strong>Main Actors:</strong> {serie.main_actors}</p>
      <p><strong>Rating:</strong> {serie.rating}</p>
      <p><strong>Release Date:</strong> {serie.release_date}</p>
      <p><strong>Seasons:</strong> {serie.seasons}</p>
      <p><strong>Thumbnail:</strong> <a href={serie.thumbnail_url} target="_blank" rel="noopener noreferrer">View Thumbnail</a></p>
    </div>
  );

  const renderEpisode = (episode) => (
    <div key={episode.id} className="series-card">
      <h3>{episode.title}</h3>
      <p><strong>Description:</strong> {episode.description}</p>
      <p><strong>Directors:</strong> {episode.directors}</p>
      <p><strong>Duration:</strong> {episode.duration ? episode.duration + ' minutes' : 'N/A'}</p>
      <p><strong>Genres:</strong> {getGenreNames(episode.genre_ids)}</p>
      <p><strong>Main Actors:</strong> {episode.main_actors}</p>
      <p><strong>Rating:</strong> {episode.rating}</p>
      <p><strong>Release Date:</strong> {episode.release_date}</p>
      <p><strong>Episode Number:</strong> {episode.episode_number}</p>
      <p><strong>Season Number:</strong> {episode.season_number}</p>
      <p><strong>Series Title:</strong> {getSeriesTitle(episode.series_id)}</p>
      <p><strong>Thumbnail:</strong> <a href={episode.thumbnail_url} target="_blank" rel="noopener noreferrer">View Thumbnail</a></p>
    </div>
  );

  return (
    <>
      <IndexNavbar />
      <IndexHeader />
      <div className="main">
        <h2>Recommended Movies</h2>
        <div className="series-container">
          {recommendedMovies.length > 0 ? (
            recommendedMovies.map(movie => renderMovie(movie))
          ) : (
            <p>No recommended movies available.</p>
          )}
        </div>
        <h2>Recommended Series</h2>
        <div className="series-container">
          {recommendedSeries.length > 0 ? (
            recommendedSeries.map(serie => renderSerie(serie))
          ) : (
            <p>No recommended series available.</p>
          )}
        </div>
        <h2>Recommended Episodes</h2>
        <div className="series-container">
          {recommendedEpisodes.length > 0 ? (
            recommendedEpisodes.map(episode => renderEpisode(episode))
          ) : (
            <p>No recommended episodes available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
