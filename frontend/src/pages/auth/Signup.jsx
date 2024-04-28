import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

import "../../assets/styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("data from signup form", data);
    
    try {
      const resp = await axios.post(`http://localhost:5000/signup`, data);
      console.log("signup data from response", resp);

      if (resp?.data?.token) {
        localStorage.setItem("token",resp?.data?.token);
        navigate("/");
      } else {
        throw new Error("Token not found !!");
      }
    } catch (err) {
      alert("Check console for detailed error !!");
      console.log(err);
    }
  };

  return (
    <div className="auth-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h4 className="form-tite">Signup</h4>
        <div className="form-group">
          <label htmlFor="name" className="input-label">
            Name
          </label>
          <input
            className="input-field"
            type="text"
            pattern="[A-Za-z]+(\s[A-Za-z]+)*"
            {...register("name", {
              required: "Name is required",
              min: 3,
            })}
          />
          {errors.name && (
            <p role="alert" className="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            pattern="[A-Za-z0-9]+@[A-Za-z]+.[A-za-z]{2,3}"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p role="alert" className="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            className="input-field"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p role="alert" className="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <button type="submit" className="form-btn">Signup</button>
        <NavLink to="/login">Have an existing account?</NavLink>
      </form>
    </div>
  );
};

export default Signup;
