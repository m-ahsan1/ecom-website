import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddProduct from "../Components/AddProduct/AddProduct";
import ListProduct from "../Components/ListProduct/ListProduct";
import AddCategory from "../Components/AddCategory/AddCategory";
import AddPromoCode from "../Components/AddPromoCode/AddPromoCode";
import "./CSS/Admin.css";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/promocode" element={<AddPromoCode />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
