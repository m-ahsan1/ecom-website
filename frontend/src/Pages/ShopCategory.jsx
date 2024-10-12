import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {
  const [allproducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const fetchInfo = () => {
    fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    // Filter products based on the selected subcategory and main category
    if (selectedSubCategory) {
      setFilteredProducts(
        allproducts.filter(
          (item) =>
            item.category === props.category &&
            item.type === selectedSubCategory
        )
      );
    } else {
      // If no subcategory is selected, show all products in the category
      setFilteredProducts(
        allproducts.filter((item) => item.category === props.category)
      );
    }
  }, [selectedSubCategory, allproducts, props.category]);


  const subCategories = {
    women: ["Sweaters", "Jackets & coats", "Shirts / blouse", "Jeans"],
    men: [
      "Shirt",
      "Pants & trouser",
      "Jackets & hoodie",
      "Sweater",
      "Pant coats",
      "Shirwani",
      "Eastren wear",
    ],
    kid: [
      "Shirt",
      "Pant & capry",
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
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1 - {filteredProducts.length}</span> out of{" "}
          {allproducts.length} Products
        </p>
        <div className="">
          Sort by <span> </span>
          <select
            className="shopcategory-sort"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
          >
            <option value="">All</option>
            {subCategories[props.category].map((option, index) => (
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
            id={item.id}
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
