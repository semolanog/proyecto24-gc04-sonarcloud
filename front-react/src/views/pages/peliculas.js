import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";
// reactstrap components
import {
  Button,
} from "reactstrap";

const Peliculas = () => {
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = "Movies";
    axios.get('http://127.0.0.1:8000/movies/')
      .then(response => {
        console.log("Fetched movies:", response.data); // Debugging log
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


  const handleSubmit = (e) => {
    e.preventDefault();
    const method = 'post';
    const url = 'http://127.0.0.1:8000/movies/';

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
      </div>
    </>
  );
};

export default Peliculas;