import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthContainer = ({ onAuthSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="auth-container">
      {isRegistering ? (
        <Register onRegisterSuccess={onAuthSuccess} />
      ) : (
        <Login onLogin={onAuthSuccess} />
      )}
      <p
        onClick={() => setIsRegistering(!isRegistering)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </p>
    </div>
  );
};

export default AuthContainer;
