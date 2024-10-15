import React from "react";
import "./Sidebar.css";
import add_product_icon from "../Assets/Product_Cart.svg";
import list_product_icon from "../Assets/Product_list_icon.svg";
import plus from "../Assets/plus.svg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/addproduct" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to="/listproduct" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>

      <Link to="/addcategory" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={plus} alt="" style={{ height: "30px", width: "30px" }} />
          <p>New category</p>
        </div>
      </Link>

      <Link to="/promocode" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={plus} alt="" style={{ height: "30px", width: "30px" }} />
          <p>Promo Code</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
