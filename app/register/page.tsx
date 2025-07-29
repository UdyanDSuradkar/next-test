"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);
    if (res.ok) {
      alert("Registration successful! Please login.");
      router.push("/");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Please fill in your details</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`primary-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            <span>Sign Up</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>

        <div className="signup-prompt">
          <p>
            Already have an account?{" "}
            <a href="/" className="signup-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
