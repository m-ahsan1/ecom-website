import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCategory.css";
import { backend_url } from "../../App";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [categories, setCategories] = useState([]);

  const addCategory = async () => {
    try {
      const response = await axios.post(`${backend_url}/addcategory`, {
        name,
        subcategories,
      });
      if (response.data.success) {
        setCategories([...categories, response.data.category]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${backend_url}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="addcategory-container">
      <h1>Add New Categories</h1>
      <form
        className="addcategory-form"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <input
          className="addcategory-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
        />
        <input
          className="addcategory-input"
          type="text"
          value={subcategories}
          onChange={(e) => setSubcategories(e.target.value)}
          placeholder="Subcategories (comma separated)"
        />
        <button className="addcategory-button" type="submit">
          Add Category
        </button>
      </form>

      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <span>{category.name}</span>
            <span className="subcategory-item">{category.subcategories}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory;
