import React, {useEffect } from 'react';
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Registro() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    admin: false,
    favorite_genre_ids: "",
    payment_method_ids: []
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Sign Up";
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://127.0.0.1:8001/users/", // URL para crear usuario
      data: formData,
      headers: {
        "Content-Type": "application/json", // Asegura que el servidor reciba JSON
        "Accept": "application/json", // Aceptar JSON como respuesta
      },
    })
      .then(() => {
        console.log("User registered successfully");
        navigate("/index"); 
      })
      .catch((error) => {
        console.error("Error registering:", error.response ? error.response.data : error);
        setError('Invalid email');
      });
  };

  return (
    <>
      <div
        className="section section-image section-login"
        style={{
          backgroundImage: "url(https://media.glamour.es/photos/658ad05932ce8ba0a777a79b/4:3/w_3304,h_2478,c_limit/SERIES%20ANIMADAS%20A.jpg)",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Container>
          <Row>
            <Col className="mx-auto" lg="4" md="6">
              <Card className="card-register">
                <h3 className="title mx-auto" style={{ fontWeight: "bold" }}>
                  Registro de usuario
                </h3>
                <Form className="register-form" onSubmit={handleSubmit}>
                <label style={{ fontWeight: "bold" }}>Email</label>
                  <InputGroup className="no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <label style={{ fontWeight: "bold" }}>Name</label>
                  <InputGroup className="no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <label style={{ fontWeight: "bold" }}>Password</label>
                  <InputGroup className="no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <label style={{ fontWeight: "bold" }}>Admin</label>
                  <InputGroup className="no-border">
                    <Input
                      type="checkbox"
                      name="admin"
                      checked={formData.admin}
                      onChange={handleChange}
                      className="form-check-input ms-2"
                      style={{
                        width: "20px",
                        height: "20px",
                        margin: "0",
                      }}
                    />
                  </InputGroup>
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    type="submit"
                  >
                    Register
                  </Button>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Registro;