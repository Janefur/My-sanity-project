import React from "react";
import { FaUser, FaArrowLeft } from 'react-icons/fa';
import {MdClose, MdLogin, } from 'react-icons/md';
import { useState } from "react";



function Login({ onLogin, onLogout, loggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!loggedInUser; // True om loggedInUser finns

  const toggleLoginForm = () => {
    setIsFormVisible(!isFormVisible);
    setError(""); // Rensa error när man stänger
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Login lyckades!
        onLogin(data.user);
        setIsFormVisible(false);
        setUsername("");
        setPassword("");
      } else {
        // Login misslyckades
        setError(data.error || 'Login misslyckades');
      }
    } catch (error) {
      setError('Kunde inte ansluta till servern');
    }
  };

  const handleLogout = () => {
    onLogout();
  };


  return (
    <div className="login">
      <div className="login-icon">
        {isLoggedIn ? (
          <button onClick={handleLogout}>
            <FaUser size={24} />
            Logga ut
          </button>
        ) : (
          <button onClick={toggleLoginForm}>
            {isFormVisible ? <MdClose size={24}  /> : <FaUser size={24} />}
            {isFormVisible ? 'Tillbaka' : "Profil"}
          </button>
        )}
      </div>
      {isFormVisible && !isLoggedIn && (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit"><MdLogin size={24} />Logga in</button>
        </form>
      )}
    </div>
  );
}
export default Login;