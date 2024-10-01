// pages/SignIn.tsx
import React, { useState, useEffect } from "react";
import "./signin.css";
import { useAuth } from "./AuthContext";
import { login, register } from "./authServices"; // Your auth service
import { Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css"; // Importing styles for toast

const LoginRegister: React.FC = () => {
  const { isAuthenticated, login: authLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const isVerified = queryParams.get("verified");

    if (isVerified) {
      toast.success("User verified successfully! Please log in.");
    }
  }, []);
  if (isAuthenticated) {
    return <Navigate to="/white-board" />;
  }

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData);
      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user_data));
      authLogin();

      toast.success(data.message); // Toast message
      console.log("Logged in:", data);
      setLoginData({ email: "", password: "" });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(registerData);
      toast.success(data.message); // Toast message
      console.log("Registered:", data);
      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      // Optionally redirect or show a message
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed! Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="main">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`wrapper ${isLogin ? "" : "active"}`}>
        <span className="rotate-bg"></span>
        <span className="rotate-bg2"></span>

        <div className="form-box login">
          <h2
            className="title animation"
            style={{ "--i": 0, "--j": 21 } as React.CSSProperties}
          >
            Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div
              className="input-box animation"
              style={{ "--i": 1, "--j": 22 } as React.CSSProperties}
            >
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <label>Email</label>
              <i className="bx bxs-user"></i>
            </div>

            <div
              className="input-box animation"
              style={{ "--i": 2, "--j": 23 } as React.CSSProperties}
            >
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <label>Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button
              type="submit"
              className="btn animation"
              style={{ "--i": 3, "--j": 24 } as React.CSSProperties}
            >
              Login
            </button>
            <div
              className="linkTxt animation"
              style={{ "--i": 5, "--j": 25 } as React.CSSProperties}
            >
              <p>
                Don't have an account?{" "}
                <span onClick={toggleForm} className="register-link">
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Register form */}
        <div className="form-box register">
          <h2
            className="title animation"
            style={{ "--i": 17, "--j": 0 } as React.CSSProperties}
          >
            Sign Up
          </h2>
          <form onSubmit={handleRegisterSubmit}>
            <div
              className="input-box animation"
              style={{ "--i": 18, "--j": 1 } as React.CSSProperties}
            >
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
              <label>Name</label>
              <i className="bx bxs-user"></i>
            </div>

            <div
              className="input-box animation"
              style={{ "--i": 19, "--j": 2 } as React.CSSProperties}
            >
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <label>Email</label>
              <i className="bx bxs-envelope"></i>
            </div>

            <div
              className="input-box animation"
              style={{ "--i": 20, "--j": 3 } as React.CSSProperties}
            >
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <label>Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div
              className="input-box animation"
              style={{ "--i": 21, "--j": 4 } as React.CSSProperties}
            >
              <input
                type="password"
                name="password_confirmation"
                value={registerData.password_confirmation}
                onChange={handleRegisterChange}
                required
              />
              <label>Confirm Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <button
              type="submit"
              className="btn animation"
              style={{ "--i": 22, "--j": 5 } as React.CSSProperties}
            >
              Sign Up
            </button>
            <div
              className="linkTxt animation"
              style={{ "--i": 23, "--j": 6 } as React.CSSProperties}
            >
              <p>
                Already have an account?{" "}
                <span onClick={toggleForm} className="login-link">
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
