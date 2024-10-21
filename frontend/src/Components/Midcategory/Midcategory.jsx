import React, { useContext, useEffect, useRef, useState } from "react";
import "./Midcategory.css";
import { Link } from "react-router-dom";
import home from "../Assets/home.png";
import women from "../Assets/women.png";
import men from "../Assets/men.png";
import kid from "../Assets/kid.png";

const midcategory = () => {
  let [menu, setMenu] = useState("shop");
  const menuRef = useRef();
  return (
    <div className="categories">
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>

        <li
          onClick={() => {
            setMenu("mens");
          }}
        >
          <Link to="/mens" style={{ textDecoration: "none" }}>
            Men
          </Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("womens");
          }}
        >
          <Link to="/womens" style={{ textDecoration: "none" }}>
            Women
          </Link>
          {menu === "womens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link to="/kids" style={{ textDecoration: "none" }}>
            Kids
          </Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
    </div>
  );
};

export default midcategory;
