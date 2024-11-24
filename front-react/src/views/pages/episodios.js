import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
// reactstrap components
import {
  Button,
} from "reactstrap";

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreSearchResults, setGenreSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [series, setSeries] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    directors: "",
    genre_ids: [],
    main_actors: "",
    rating: "",
    release_date: "",
    thumbnail_url: "",
    title: "",
    duration: "",
    episode_number: "",
    season_number: "",
    series_id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentEpisodeId, setCurrentEpisodeId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Episodes";
    axios.get('http://127.0.0.1:8000/episodes/')
      .then(response => setEpisodes(response.data))
      .catch(error => console.error("Error fetching episodes:", error));

    axios.get('http://127.0.0.1:8000/series/')
      .then(response => setSeries(response.data))
      .catch(error => console.error('Error fetching series:', error));

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
    axios.get(`http://127.0.0.1:8000/episodes/?search=${searchQuery}`)
      .then(response => setSearchResults(response.data))
      .catch(error => console.error("Error searching episodes:", error));
  };

  const handleGenreSearch = (genreId) => {
    axios.get(`http://127.0.0.1:8000/episodes/?genre_ids=${genreId}`)
      .then(response => setGenreSearchResults(response.data))
      .catch(error => console.error("Error searching episodes by genre:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editMode ? 'put' : 'post';
    const url = editMode ? `http://127.0.0.1:8000/episodes/${currentEpisodeId}/` : 'http://127.0.0.1:8000/episodes/';

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
        setEpisodes(prev => editMode ? prev.map(p => p.id === currentEpisodeId ? response.data : p) : [...prev, response.data]);
        setEditMode(false);
        setFormData({
          description: "",
          directors: "",
          genre_ids: [],
          main_actors: "",
          rating: "",
          release_date: "",
          thumbnail_url: "",
          title: "",
          duration: "",
          episode_number: "",
          season_number: "",
          series_id: "",
        });
      })
      .catch(error => {
        console.error("Error saving episode:", error.response ? error.response.data : error);
      });
  };

  const handleEdit = (episode) => {
    setFormData({
      description: episode.description || "",
      directors: episode.directors || "",
      genre_ids: episode.genre_ids || [],
      main_actors: episode.main_actors || "",
      rating: episode.rating || "",
      release_date: episode.release_date || "",
      thumbnail_url: episode.thumbnail_url || "",
      title: episode.title || "",
      duration: episode.duration || "",
      episode_number: episode.episode_number || "",
      season_number: episode.season_number || "",
      series_id: episode.series_id || ""
    });
    setEditMode(true);
    setCurrentEpisodeId(episode.id);
  };

  const handleDelete = (episodeId) => {
    axios.delete(`http://127.0.0.1:8000/episodes/${episodeId}/`)
      .then(() => {
        setEpisodes(prev => prev.filter(p => p.id !== episodeId));
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

  const getSeriesTitle = (seriesId) => {
    const serie = series.find(s => s.id === seriesId);
    return serie ? serie.title : 'Unknown';
  };

  const EpisodeCard = ({ episode }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [watched, setWatched] = useState(false);

    useEffect(() => {
      if (user) {
        axios.get(`http://127.0.0.1:8002/watched-episodes/?user_id=${user.id}&episode_id=${episode.id}`)
          .then(response => {
            setWatched(response.data.length > 0);
          })
          .catch(error => console.error("Error fetching watched status:", error));
      }
    }, [user, episode.id]);

    const toggleWatchedStatus = () => {
      const url = `http://127.0.0.1:8002/watched-episodes/`;
      const method = watched ? 'delete' : 'post';
      const data = watched ? {} : { user_id: user.id, episode_id: episode.id };

      axios({
        method,
        url: watched ? `${url}?user_id=${user.id}&episode_id=${episode.id}` : url,
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
          console.error(`Error ${watched ? 'unmarking' : 'marking'} episode as watched:`, error.response ? error.response.data : error);
        });
    };

    return (
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
        {isAdmin && (
          <>
            <Button className="btn-round ml-1" color="info" type="button" onClick={() => handleEdit(episode)}>
              Editar
            </Button>
            <Button className="btn-round mr-1" color="danger" type="button" onClick={() => handleDelete(episode.id)}>
              Eliminar
            </Button>

          </>
        )}
        <Button className="btn-round ml-1" color={watched ? "warning" : "success"} type="button" onClick={toggleWatchedStatus}>
              {watched ? "Desmarcar episodio" : "Ver episodio"}
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
          <h1 style={{ fontWeight: "bold" , color: 'darkred'}}>Episodes</h1>
          <h3>Search by title</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search episode"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="series-container">
          {searchResults.map(episode => <EpisodeCard key={episode.id} episode={episode} />)}
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
          {genreSearchResults.map(episode => <EpisodeCard key={episode.id} episode={episode} />)}
        </div>

        {isAdmin ? (
          <>
            <h2>Add Episode</h2>
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
                <label>Genres (Ctrl + to add)</label>
                <select multiple name="genre_ids" value={formData.genre_ids} onChange={handleGenreChange}>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Episode Number</label>
                <input type="number" name="episode_number" value={formData.episode_number} onChange={handleInputChange} placeholder="Episode Number" />
              </div>
              <div className="form-group">
                <label>Season Number</label>
                <input type="number" name="season_number" value={formData.season_number} onChange={handleInputChange} placeholder="Season Number" />
              </div>
              <div className="form-group">
                <label>Series Title</label>
                <select name="series_id" value={formData.series_id} onChange={handleInputChange} required>
                  <option value="" disabled>Select a series</option>
                  {series.map(serie => (
                    <option key={serie.id} value={serie.id}>{serie.title}</option>
                  ))}
                </select>
              </div>
              <button type="submit">{editMode ? "Update" : "Create"} episode</button>
            </form>
          </>
        ) : null}
        <div className="series-container">
          {episodes.map(episode => <EpisodeCard key={episode.id} episode={episode} />)}
        </div>
      </div>
    </>
  );
};

export default Episodes;