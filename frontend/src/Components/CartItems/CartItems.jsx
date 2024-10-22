import React, { useContext, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const CartItems = () => {
  const { products, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);
  console.log(
    "CartItems.js",
    products,
    cartItems,
    removeFromCart,
    getTotalCartAmount
  );
  const [promoCode, setPromoCode] = useState(""); // For promo code input
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(null); // For order success message

  // Handle input changes for shipping details
  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const orderedProducts = products
        .filter((product) => cartItems[product._id] > 0)
        .map((product) => ({
          productId: product._id,
          quantity: cartItems[product._id],
        }));

      const response = await fetch(`${backend_url}/placeorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          products: orderedProducts,
          shippingDetails,
          promoCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess("Order placed successfully!");
        // Clear cart or perform other actions as necessary
      } else {
        setOrderSuccess(`Order failed: ${data.error}`);
      }
    } catch (error) {
      setOrderSuccess(`Order failed: ${error.message}`);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e._id] > 0) {
          return (
            <div key={e._id}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={backend_url + e.image}
                  alt=""
                />
                <p className="cartitems-product-title">{e.name}</p>
                <p>
                  {currency}
                  {e.new_price}
                </p>
                <button className="cartitems-quantity">
                  {cartItems[e._id]}
                </button>
                <p>
                  {currency}
                  {e.new_price * cartItems[e._id]}
                </p>
                <img
                  onClick={() => removeFromCart(e._id)}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>
                {currency}
                {getTotalCartAmount()}
              </h3>
            </div>
          </div>

          <div className="cartitems-shipping">
            <h2>Shipping Details</h2>
            <div class="customer-name">
              <input
                type="text"
                Firstname="Firstname"
                placeholder="Firstname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                lasttname="lastname"
                placeholder="Lastname"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleInputChange}
            />
            <input
              type="text"
              city="city"
              placeholder="city"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="Add special note"
              placeholder="Add special note"
              onChange={handleInputChange}
            />
            <div class="checkbox">
              <input
                type="checkbox"
                name="checkbox"
                placeholder="Add special note"
                onChange={handleInputChange}
              />
              <b>Save this information</b>
            </div>
          </div>

          <button onClick={placeOrder}>PROCEED TO CHECKOUT</button>

          {orderSuccess && <p>{orderSuccess}</p>}
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
