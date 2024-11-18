import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Slices/authSlice.js"; // import the login async thunk
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Wait for the login action to complete
      const result = await dispatch(login({ email, password })).unwrap(); // Using `unwrap` to wait for the action's result
      if (result) {
        toast.success("Login Successful");
        Navigate('/post'); // Navigate only after successful login
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      console.error("LOGIN.JSX ERROR: ", err);
    }
  };

  return (
    <div className="log">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>

            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to={'/register'}>Register</Link>
        </form>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
