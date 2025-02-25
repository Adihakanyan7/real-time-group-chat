import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", 
                { username, email, password }, 
                { withCredentials: true }
            );
            onRegisterSuccess(res.data.user);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleRegister}>Register</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;
