import React from "react";
import "./Midcategory.css";
import { Link } from "react-router-dom";
import home from "../Assets/home.png";
import women from "../Assets/women.png";
import men from "../Assets/men.png";
import kid from "../Assets/kid.png";

const Midcategory = () => {
  return (
    <div className="categories-container">
      <h1>CATEGORIES</h1>
      <div className="image-grid">
        <Link to="/" className="image-container">
          <img src={home} alt="Home" className="category-image" />
          <div className="image-link">Home</div>
        </Link>

        <Link to="/womens" className="image-container">
          <img src={women} alt="Women" className="category-image" />
          <div className="image-link">Women</div>
        </Link>

        <Link to="/mens" className="image-container">
          <img src={men} alt="Men" className="category-image" />
          <div className="image-link">Men</div>
        </Link>

        <Link to="/kids" className="image-container">
          <img src={kid} alt="Kid" className="category-image" />
          <div className="image-link">Kids</div>
        </Link>
      </div>
    </div>
  );
};

export default Midcategory;
