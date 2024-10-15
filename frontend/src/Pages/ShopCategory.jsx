import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [error, setError] = useState(null); // To handle fetch errors

  const fetchInfo = () => {
    fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    // Filter products based on the selected subcategory and main category
    if (selectedSubCategory) {
      setFilteredProducts(
        allProducts.filter(
          (item) =>
            item.category === props.category &&
            item.type === selectedSubCategory
        )
      );
    } else {
      // If no subcategory is selected, show all products in the category
      setFilteredProducts(
        allProducts.filter((item) => item.category === props.category)
      );
    }
  }, [selectedSubCategory, allProducts, props.category]);

  const subCategories = {
    women: ["Sweaters", "Jackets & coats", "Shirts / blouse", "Jeans"],
    men: [
      "Shirt",
      "Pants & trouser",
      "Jackets & hoodie",
      "Sweater",
      "Pant coats",
      "Shirwani",
      "Eastern wear",
    ],
    kid: [
      "Shirt",
      "Pant & capri",
      "Jackets & hoodie",
      "Sweatshirt",
      "Maxi dresses",
      "Ready to wear",
      "Barbie dresses",
    ],
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
  };

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      {error && <p className="error-message">{error}</p>} {/* Display error */}
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1 - {filteredProducts.length}</span> out of{" "}
          {allProducts.length} Products
        </p>
        <div className="">
          Sort by <span> </span>
          <select
            className="shopcategory-sort"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
          >
            <option value="">All</option>
            {subCategories[props.category]?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
          <Item
            id={item._id} // Ensure id is properly mapped from backend
            key={i}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        <Link to="/" style={{ textDecoration: "none" }}>
          Explore More
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;
