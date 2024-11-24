import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
// reactstrap components
import {
  Button,
} from "reactstrap";

const Series = () => {
  const [series, setSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreSearchResults, setGenreSearchResults] = useState([]);
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
  const [editMode, setEditMode] = useState(false);
  const [currentSerieId, setCurrentSerieId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Series";
    axios.get('http://127.0.0.1:8000/series/')
      .then(response => setSeries(response.data))
      .catch(error => console.error("Error fetching series:", error));

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

  const handleGenreSearch = (genreId) => {
    axios.get(`http://127.0.0.1:8000/series/?genre_ids=${genreId}`)
      .then(response => setGenreSearchResults(response.data))
      .catch(error => console.error("Error searching series by genre:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editMode ? 'put' : 'post';
    const url = editMode ? `http://127.0.0.1:8000/series/${currentSerieId}/` : 'http://127.0.0.1:8000/series/';

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
        setSeries(prev => editMode ? prev.map(p => p.id === currentSerieId ? response.data : p) : [...prev, response.data]);
        setEditMode(false);
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

  const handleEdit = (serie) => {
    setFormData({
      description: serie.description || "",
      directors: serie.directors || "",
      duration: serie.duration || "",
      episode_average_duration: serie.episode_average_duration || "",
      genre_ids: serie.genre_ids || [],
      main_actors: serie.main_actors || "",
      rating: serie.rating || "",
      release_date: serie.release_date || "",
      seasons: serie.seasons || "",
      thumbnail_url: serie.thumbnail_url || "",
      title: serie.title || ""
    });
    setEditMode(true);
    setCurrentSerieId(serie.id);
  };

  const handleDelete = (serieId) => {
    axios.delete(`http://127.0.0.1:8000/series/${serieId}/`)
      .then(() => {
        setSeries(prev => prev.filter(p => p.id !== serieId));
      })
      .catch(error => {
        console.error("Error deleting user:", error.response ? error.response.data : error);
      });
  };

  const getGenreNames = (genreIds) => {
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : "Unknown";
    }).join(', ');
  };

  const SerieCard = ({ serie }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [watched, setWatched] = useState(false);

    useEffect(() => {
      if (user) {
        axios.get(`http://127.0.0.1:8002/watched-series/?user_id=${user.id}&series_id=${serie.id}`)
          .then(response => {
            setWatched(response.data.length > 0);
          })
          .catch(error => console.error("Error fetching watched status:", error));
      }
    }, [user, serie.id]);

    const toggleWatchedStatus = () => {
      const url = `http://127.0.0.1:8002/watched-series/`;
      const method = watched ? 'delete' : 'post';
      const data = watched ? {} : { user_id: user.id, series_id: serie.id };

      axios({
        method,
        url: watched ? `${url}?user_id=${user.id}&series_id=${serie.id}` : url,
        data,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
        .then(() => {
          setWatched(!watched);
        })
        .catch(error => {
          console.error(`Error ${watched ? 'unmarking' : 'marking'} series as watched:`, error.response ? error.response.data : error);
        });
    };

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
        {isAdmin && (
          <>
            <Button className="btn-round ml-1" color="info" type="button" onClick={() => handleEdit(serie)}>
              Editar
            </Button>
            <Button className="btn-round mr-1" color="danger" type="button" onClick={() => handleDelete(serie.id)}>
              Eliminar
            </Button>

          </>
        )}
        <Button className="btn-round ml-1" color={watched ? "warning" : "success"} type="button" onClick={toggleWatchedStatus}>
              {watched ? "Desmarcar serie" : "Ver serie"}
        </Button>
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
        <h3>Search by genre</h3>
        <div className="series-container">
          {genres.map(genre => (
            <Button style={{border: '2px solid #000'}} className="btn-round ml-1" color="info" type="button" key={genre.id} onClick={() => handleGenreSearch(genre.id)}>
              {genre.name}
            </Button>
          ))}
        </div>
        <div className="series-container">
          {genreSearchResults.map(serie => <SerieCard key={serie.id} serie={serie} />)}
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
              <button type="submit" className="submit-button">{editMode ? "Update" : "Create"} serie</button>
            </form>
          </>
        ) : null}

        <div className="series-container">
          {series.map(serie => <SerieCard key={serie.id} serie={serie} />)}
        </div>
      </div>
    </>
  );
};

export default Series;