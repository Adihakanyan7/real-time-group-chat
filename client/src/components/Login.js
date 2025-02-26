import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = ({ onLogin }) => {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");


        try {
            const response = await axios.post("http://localhost:3000/api/auth/login",
                { email: loginEmail, password: loginPassword },
                { withCredentials: true }
            );
            if (response.status === 200) {
                onLogin(response.data.user)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );

}

export default Login;
