import React, { useState } from "react";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate("/*"); // Replace "/*" with the desired path for the authorized area
    } catch (error) {
      setError("Invalid Credentials.", error)
    }
  };

  return (
    <div className="Container login">
      <h1>Login</h1>
      <hr className="other-hr" />
      <div className="login-form">
        <Form onSubmit={handleSubmit}>
          <Form.Label></Form.Label>
          <Form.Group className="login-input">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="login-input">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {error && <p>{error}</p>}
          <Button className="primary wsd login-input extra-headroom" type="submit">
            Log In
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
