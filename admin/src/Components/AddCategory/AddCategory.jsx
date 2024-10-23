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
        subcategories: subcategories.split(",").map((subcat) => subcat.trim()),
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
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
        />
        <input
          type="text"
          value={subcategories}
          onChange={(e) => setSubcategories(e.target.value)}
          placeholder="Subcategories (comma-separated)"
        />
        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <strong>Category: </strong>
            {category.name}
            <ul>
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((subcat, i) => (
                  <li key={i}>{subcat}</li>
                ))
              ) : (
                <li>No subcategories</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory;
