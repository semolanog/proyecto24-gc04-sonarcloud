import React, { useState } from "react";
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

function SectionLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.get(`http://127.0.0.1:8001/users/?email=${formData.email}`)
      .then(response => {
        const user = response.data[0]; // Assuming the API returns an array of users
        if (user && user.password === formData.password) {
          // Password matches, handle successful login
          sessionStorage.setItem('user', JSON.stringify(user));
          window.location.href = '/index-inicio'; // Redirect to home page or any other page
        } else {
          // Password does not match
          setError('Invalid email or password');
        }
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        setError('Invalid email or password');
      });
  };

  return (
    <>
      <div
        className="section section-image section-login"
        style={{
          backgroundImage: "url(https://media.glamour.es/photos/658ad05932ce8ba0a777a79b/4:3/w_3304,h_2478,c_limit/SERIES%20ANIMADAS%20A.jg)",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Container>
          <Row>
            <Col className="mx-auto" lg="4" md="6">
              <Card className="card-register">
                <h3 className="title mx-auto" style={{ fontWeight: "bold" }} >Bienvenido a Netflix</h3>
                <Form className="register-form" onSubmit={handleSubmit}>
                  <label style={{ fontWeight: "bold" }} >Email</label>
                  <InputGroup className="form-group-no-border">
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
                  <label style={{ fontWeight: "bold" }} >Password</label>
                  <InputGroup className="form-group-no-border">
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
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <Button
                    block
                    className="btn-round"
                    color="danger"
                    type="submit"
                  >
                    Login
                  </Button>
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    onClick={() => navigate("/registro")}
                  >
                    Register
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default SectionLogin;