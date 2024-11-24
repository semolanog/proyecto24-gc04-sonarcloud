import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
// reactstrap components
import {
  Button,
} from "reactstrap";

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreSearchResults, setGenreSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    directors: "",
    duration: "",
    genre_ids: [],
    main_actors: "",
    rating: "",
    release_date: "",
    thumbnail_url: "",
    title: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [currentPeliculaId, setCurrentPeliculaId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Movies";
    axios.get('http://127.0.0.1:8000/movies/')
      .then(response => {
        console.log("Fetched movies:", response.data); // Debugging log
        setPeliculas(response.data);
      })
      .catch(error => console.error("Error fetching movies:", error));

    axios.get('http://127.0.0.1:8000/genres/')
      .then(response => {
        console.log("Fetched genres:", response.data); // Debugging log
        setGenres(response.data);
      })
      .catch(error => console.error("Error fetching genres:", error));

    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log("User data:", user); // Debugging log
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
    axios.get(`http://127.0.0.1:8000/movies/?search=${searchQuery}`)
      .then(response => {
        console.log("Search results:", response.data); // Debugging log
        setSearchResults(response.data);
      })
      .catch(error => console.error("Error searching peliculas:", error));
  };

  const handleGenreSearch = (genreId) => {
    axios.get(`http://127.0.0.1:8000/movies/?genre_ids=${genreId}`)
      .then(response => {
        console.log("Genre search results:", response.data); // Debugging log
        setGenreSearchResults(response.data);
      })
      .catch(error => console.error("Error searching peliculas by genre:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editMode ? 'put' : 'post';
    const url = editMode ? `http://127.0.0.1:8000/movies/${currentPeliculaId}/` : 'http://127.0.0.1:8000/movies/';

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
        setPeliculas(prev => editMode ? prev.map(p => p.id === currentPeliculaId ? response.data : p) : [...prev, response.data]);
        setEditMode(false);
        setFormData({
          description: "",
          directors: "",
          duration: "",
          genre_ids: [],
          main_actors: "",
          rating: "",
          release_date: "",
          thumbnail_url: "",
          title: ""
        });
      })
      .catch(error => {
        console.error("Error saving pelicula:", error.response ? error.response.data : error);
      });
  };

  const handleEdit = (pelicula) => {
    setFormData({
      description: pelicula.description || "",
      directors: pelicula.directors || "",
      duration: pelicula.duration || "",
      genre_ids: pelicula.genre_ids || [],
      main_actors: pelicula.main_actors || "",
      rating: pelicula.rating || "",
      release_date: pelicula.release_date || "",
      thumbnail_url: pelicula.thumbnail_url || "",
      title: pelicula.title || ""
    });
    setEditMode(true);
    setCurrentPeliculaId(pelicula.id);
  };

  const handleDelete = (peliculaId) => {
    axios.delete(`http://127.0.0.1:8000/movies/${peliculaId}/`)
      .then(() => {
        setPeliculas(prev => prev.filter(p => p.id !== peliculaId));
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

  const PeliculaCard = ({ pelicula }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [watched, setWatched] = useState(false);

    useEffect(() => {
      if (user) {
        axios.get(`http://127.0.0.1:8002/watched-movies/?user_id=${user.id}&movie_id=${pelicula.id}`)
          .then(response => {
            setWatched(response.data.length > 0);
          })
          .catch(error => console.error("Error fetching watched status:", error.response ? error.response.data : error));
      }
    }, [user, pelicula.id]);

    const toggleWatchedStatus = () => {
      const url = `http://127.0.0.1:8002/watched-movies/`;
      const method = watched ? 'delete' : 'post';
      const data = watched ? {} : { user_id: user.id, movie_id: pelicula.id };
    
      axios({
        method,
        url: watched ? `${url}?user_id=${user.id}&movie_id=${pelicula.id}` : url,
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
          console.error(`Error ${watched ? 'unmarking' : 'marking'} movie as watched:`, error.response ? error.response.data : error);
        });
    };

    return (
      <div key={pelicula.id} className="series-card">
        <h3 style={{color: 'darkred', fontWeight: 'bold'}}>{pelicula.title}</h3>
        <p><strong>Description:</strong> {pelicula.description}</p>
        <p><strong>Directors:</strong> {pelicula.directors}</p>
        <p><strong>Duration:</strong> {pelicula.duration} minutes</p>
        <p><strong>Genres:</strong> {getGenreNames(pelicula.genre_ids)}</p>
        <p><strong>Main Actors:</strong> {pelicula.main_actors}</p>
        <p><strong>Rating:</strong> {pelicula.rating}</p>
        <p><strong>Release Date:</strong> {pelicula.release_date}</p>
        <p><strong>Thumbnail:</strong> <a href={pelicula.thumbnail_url} target="_blank" rel="noopener noreferrer">View Thumbnail</a></p>
        {isAdmin && (
          <>
            <Button className="btn-round ml-1" color="info" type="button" onClick={() => handleEdit(pelicula)}>
              Editar
            </Button>
            <Button className="btn-round mr-1" color="danger" type="button" onClick={() => handleDelete(pelicula.id)}>
              Eliminar
            </Button>

          </>
        )}
        <Button className="btn-round ml-1" color={watched ? "warning" : "success"} type="button" onClick={toggleWatchedStatus}>
              {watched ? "Desmarcar pelicula" : "Ver pelicula"}
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
          <h1 style={{ fontWeight: "bold" , color: 'darkred'}} >Movies</h1>
          <h3>Search by title</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search movie"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="series-container">
          {searchResults.map(pelicula => <PeliculaCard key={pelicula.id} pelicula={pelicula} />)}
        </div>
        <h3>Search to genre</h3>
        <div className="series-container">
          {genres.map(genre => (
            <Button style={{border: '2px solid #000'}} className="btn-round ml-1" color="info" type="button" key={genre.id} onClick={() => handleGenreSearch(genre.id)}>
              {genre.name}
            </Button>
          ))}
        </div>
        <div className="series-container">
          {genreSearchResults.map(pelicula => <PeliculaCard key={pelicula.id} pelicula={pelicula} />)}
        </div>

        {isAdmin ? (
          <>
            <h2>Add Movie</h2>
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
                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration" />
              </div>
              <div className="form-group">
                <label>Genres</label>
                <select multiple name="genre_ids" value={formData.genre_ids} onChange={handleGenreChange}>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Main Actors</label>
                <input type="text" name="main_actors" value={formData.main_actors} onChange={handleInputChange} placeholder="Main Actors" />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="Rating" />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} placeholder="Release Date" />
              </div>
              <div className="form-group">
                <label>Thumbnail URL</label>
                <input type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleInputChange} placeholder="Thumbnail URL" />
              </div>
              <Button type="submit" color="primary">Save</Button>
            </form>
          </>
        ) : null}
        <div className="series-container">
          {peliculas.map(pelicula => <PeliculaCard key={pelicula.id} pelicula={pelicula} />)}
        </div>
      </div>
    </>
  );
};

export default Peliculas;