import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
// reactstrap components

const Series = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    directors: "",
    duration: "",
    episode_average_duration: "",
    genre_ids: [],
    main_actors: "",
    rating: "",
    release_date: "",
    seasons: "",
    thumbnail_url: "",
    title: ""
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Series";

    axios.get('http://127.0.0.1:8000/genres/')
      .then(response => setGenres(response.data))
      .catch(error => console.error("Error fetching genres:", error));

    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log("User data:", user);
    if (user && user.admin) {
      setIsAdmin(true);
    } else {
      console.log("User is not admin or user data is not available");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e) => {
    const options = e.target.options;
    const selectedGenres = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedGenres.push(parseInt(options[i].value));
      }
    }
    setFormData({ ...formData, genre_ids: selectedGenres });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    axios.get(`http://127.0.0.1:8000/series/?search=${searchQuery}`)
      .then(response => setSearchResults(response.data))
      .catch(error => console.error("Error searching series:", error));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const method = 'post';
    const url = 'http://127.0.0.1:8000/series/';

    axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then(response => {
        setFormData({
          description: "",
          directors: "",
          duration: "",
          episode_average_duration: "",
          genre_ids: [],
          main_actors: "",
          rating: "",
          release_date: "",
          seasons: "",
          thumbnail_url: "",
          title: ""
        });
      })
      .catch(error => {
        console.error("Error saving serie:", error.response ? error.response.data : error);
      });
  };


  const getGenreNames = (genreIds) => {
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : "Unknown";
    }).join(', ');
  };

  const SerieCard = ({ serie }) => {
    return (
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
  };

  return (
    <>
      <IndexNavbar />
      <div
        className="center-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: '200px',
        }}>
        <div>
          <h1 style={{ fontWeight: "bold" , color: 'darkred'}}>Series</h1>
          <h3>Search by title</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search serie"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="series-container">
          {searchResults.map(serie => <SerieCard key={serie.id} serie={serie} />)}
        </div>

        {isAdmin ? (
          <>
            <h2>Add Series</h2>
            <form onSubmit={handleSubmit} className="form-to">
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
              </div>
              <div className="form-group">
                <label>Directors</label>
                <input type="text" name="directors" value={formData.directors} onChange={handleInputChange} placeholder="Directors" />
              </div>
              <div className="form-group">
                <label>Seasons</label>
                <input type="number" name="seasons" value={formData.seasons} onChange={handleInputChange} placeholder="Seasons" />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} placeholder="End Date" />
              </div>
              <div className="form-group">
                <label>Average Episode Duration</label>
                <input type="number" name="episode_average_duration" value={formData.episode_average_duration} onChange={handleInputChange} placeholder="Episode Average Duration" />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration" />
              </div>
              <div className="form-group">
                <label>Main Actors</label>
                <input type="text" name="main_actors" value={formData.main_actors} onChange={handleInputChange} placeholder="Main Actors" />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="Rating" />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} placeholder="Release Date" />
              </div>
              <div className="form-group">
                <label>Thumbnail URL</label>
                <input type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleInputChange} placeholder="Thumbnail URL" />
              </div>
              <div className="form-group">
                <label>Genres (Ctrl. + para añadir)</label>
                <select multiple name="genre_ids" value={formData.genre_ids} onChange={handleGenreChange}>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-button">{"Create"} serie</button>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Series;