import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndexNavbar from "components/Navbars/IndexNavbar.js";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    admin: false,
    favorite_genre_ids: '',
    payment_method_ids: [], // Ahora es un array de IDs
    password: '',
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  useEffect(() => {
    document.title = "Profile";
    // Obtener los datos del usuario desde sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name,
        email: storedUser.email,
        admin: storedUser.admin,
        favorite_genre_ids: storedUser.favorite_genre_ids,
        payment_method_ids: storedUser.payment_method_ids, // Guardamos los IDs como array
        password: storedUser.password
      });

      // Obtener los métodos de pago
      axios({
        method: "get",
        url: 'http://127.0.0.1:8001/payment-methods/',
      })
        .then(response => {
          setPaymentMethods(response.data); // Guardamos todos los métodos de pago disponibles
        })
        .catch(error => console.error('Error fetching payment methods:', error));

      // Obtener todos los usuarios si el usuario es admin
      if (storedUser.admin) {
        axios({
          method: "get",
          url: 'http://127.0.0.1:8001/users/',
        })
          .then(response => {
            setAllUsers(response.data);
          })
          .catch(error => console.error('Error fetching users:', error));
      }
    }
  }, []);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);

    axios.get('http://127.0.0.1:8000/genres/')
      .then(response => setGenres(response.data))
      .catch(error => console.error("Error fetching genres:", error));
  }, []);

  useEffect(() => {
    if (user && user.favorite_genre_ids) {
      const genreIds = user.favorite_genre_ids.split(',').map(id => parseInt(id.trim()));
      const favoriteGenres = genreIds.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : "Unknown";
      });
      setFavoriteGenres(favoriteGenres);
    }
  }, [user, genres]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'payment_method_ids') {
      const updatedPaymentMethods = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({
        ...formData,
        [name]: updatedPaymentMethods, // Guardamos los IDs seleccionados
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleGenreChange = (e) => {
    const options = e.target.options;
    const selectedGenres = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedGenres.push(options[i].value);
      }
    }
    setFormData({ ...formData, favorite_genre_ids: selectedGenres.join(',') });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      payment_method_ids: formData.payment_method_ids.map(id => parseInt(id)), // Convertimos los IDs a números
      favorite_genre_ids: formData.favorite_genre_ids.split(',').map(id => parseInt(id.trim())).join(','),
      password: formData.password 
    };

    axios({
      method: "put",
      url: `http://127.0.0.1:8001/users/${user.id}/`,
      data: updatedFormData,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((response) => {
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        setEditMode(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating user data:", error.response ? error.response.data : error);
      });
  };

  const handleDelete = (userId) => {
    axios({
      method: "delete",
      url: `http://127.0.0.1:8001/users/${userId}/`,
    })
      .then(() => {
        // Reload the list of users after deleting a user
        axios({
          method: "get",
          url: 'http://127.0.0.1:8001/users/',
        })
          .then(response => {
            setAllUsers(response.data);
          })
          .catch(error => console.error('Error fetching users:', error));
      })
      .catch((error) => {
        console.error("Error deleting user:", error.response ? error.response.data : error);
      });
  };


  if (!user) return <div>Loading...</div>;

  return (
    <>
      <IndexNavbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-card">
          {editMode ? (
            <form onSubmit={handleSave}>
              <label>Name</label>
              <input
                className="profile-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <label>Email</label>
              <input
                className="profile-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <label>Admin</label>
              <input
                className="profile-input"
                type="checkbox"
                name="admin"
                checked={formData.admin}
                onChange={handleInputChange}
              />
              <label>Favorite Genres:</label>
              <select
                className="profile-input"
                name="favorite_genre_ids"
                value={formData.favorite_genre_ids.split(',')}
                onChange={handleGenreChange}
                multiple
              >
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <label>Payment Methods</label>
              <select
                className="profile-input"
                name="payment_method_ids"
                value={formData.payment_method_ids}
                onChange={handleInputChange}
                multiple // Esto permite seleccionar múltiples opciones
              >
                {paymentMethods.map((method) => (
                  <option
                    key={method.id}
                    value={method.id}
                    selected={formData.payment_method_ids.includes(method.id.toString())} // Se mantiene seleccionados los métodos previamente guardados
                  >
                    {method.type} {/* Aquí se muestra el nombre de la forma de pago */}
                  </option>
                ))}
              </select>
              <button type="submit">Save</button>
            </form>
          ) : (
            <div>
              <p className="profile-info"><strong>Name:</strong> {user.name}</p>
              <p className="profile-info"><strong>Email:</strong> {user.email}</p>
              <p className="profile-info"><strong>Admin:</strong> {user.admin ? "Yes" : "No"}</p>
              <p><strong>Favorite Genres:</strong> {favoriteGenres.join(', ')}</p>
              <p>
                <strong>Payment Methods:</strong>{" "}
                {paymentMethods
                  .filter(method => user.payment_method_ids.includes(method.id))
                  .map(method => method.type)
                  .join(", ")}
              </p>
              <button onClick={handleEdit}>Edit</button>
            </div>
          )}
        </div>
        {user.admin && (
          <div className="user-list">
            <h2>User List</h2>
            <ul>
              {allUsers.map((u) => (
                <li key={u.id}>
                  {u.name} ({u.email})
                  <button onClick={() => handleDelete(u.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Perfil;
