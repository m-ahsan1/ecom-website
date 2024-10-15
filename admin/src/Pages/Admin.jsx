import React from "react";
import "./CSS/Admin.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddProduct from "../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../Components/ListProduct/ListProduct";
import AddCategory from "../Components/AddCategory/AddCategory";
import AddPromoCode from "../Components/AddPromoCode/AddPromoCode";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/promocode" element={<AddPromoCode />} />
      </Routes>
    </div>
  );
};

export default Admin;
