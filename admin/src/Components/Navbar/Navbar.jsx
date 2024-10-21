import React from "react";
import "./Navbar.css";
import navlogo from "../Assets/logo.jpeg";
import navprofileIcon from "../Assets/nav-profile.svg";
import mainlogo from "../Assets/main-logo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="" />
      <p>KOOGLE ARDEN</p>
      <img src={navprofileIcon} className="nav-profile" alt="" />
    </div>
  );
};

export default Navbar;
