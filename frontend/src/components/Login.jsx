import React from "react";
import { FaUser } from "react-icons/fa";
import { MdClose, MdLogin } from "react-icons/md";
import { useState } from "react";

function Login({ onLogin, onLogout, loggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!loggedInUser;

  const openModal = () => {
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
        closeModal();
      } else {
        setError(data.error || "Login misslyckades");
      }
    } catch (error) {
      setError("Kunde inte ansluta till servern");
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="login">
      <div className="login-icon">
        {isLoggedIn ? (
          <div className="iconTextContainer">
            <FaUser
              size={22}
              style={{ color: "white", position: "absolute", left: "0" }}
              onClick={handleLogout}
            />
            <p>Logga ut</p>
          </div>
        ) : (
          <div className="iconTextContainer">
            <FaUser
              size={22}
              style={{ color: "white", position: "absolute", left: "0" }}
              onClick={openModal}
            />
            <p>Logga in</p>
          </div>
        )}
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && !isLoggedIn && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Logga in</h2>
              <button className="modal-close" onClick={closeModal}>
                <MdClose size={24} />
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <label>
                  Användarnamn:
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Lösenord:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="login-btn">
                  <MdLogin size={20} />
                  Logga in
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
