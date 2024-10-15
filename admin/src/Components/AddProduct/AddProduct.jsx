import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";

const categories = {
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

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    type: "",
    new_price: "",
    old_price: "",
    quantity: 0,
    availableSizes: [],
  });

  const renderCategories = () => {
    const { category } = productDetails;
    const options = categories[category] || [];

    return options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ));
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    if (!sizes.includes(value)) {
      setSizes([...sizes, value]);
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const AddProduct = async () => {
    let dataObj;
    let product = { ...productDetails, availableSizes: sizes };

    let formData = new FormData();
    formData.append("product", image);

    await fetch(`${backend_url}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        dataObj = data;
      });

    if (dataObj.success) {
      product.image = dataObj.image_url;
      await fetch(`${backend_url}/addproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success ? alert("Product Added") : alert("Failed");
        });
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input
          type="text"
          name="description"
          value={productDetails.description}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="number"
            name="old_price"
            value={productDetails.old_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="number"
            name="new_price"
            value={productDetails.new_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select
          value={productDetails.category}
          name="category"
          className="add-product-selector"
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Sub-category</p>
        <select
          value={productDetails.type}
          name="type"
          className="add-product-selector"
          onChange={changeHandler}
        >
          {renderCategories()}
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Available Sizes</p>
        <select
          className="add-product-selector"
          onChange={handleSizeChange}
          value=""
        >
          <option value="">Select Size</option>
          {availableSizes.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>
        <div className="selected-sizes">
          {sizes.map((size, index) => (
            <div key={index} className="size-tag">
              {size}
              <button onClick={() => removeSize(size)}>X</button>
            </div>
          ))}
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Quantity</p>
        <input
          type="number"
          name="quantity"
          value={productDetails.quantity}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={!image ? upload_area : URL.createObjectURL(image)}
            alt=""
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          name="image"
          id="file-input"
          accept="image/*"
          hidden
        />
      </div>
      <button className="addproduct-btn" onClick={AddProduct}>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
