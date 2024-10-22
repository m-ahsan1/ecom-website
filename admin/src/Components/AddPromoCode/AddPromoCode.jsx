import React, { useState, useEffect } from "react";
import "./AddPromoCode.css";
import axios from "axios";
import { backend_url } from "../../App";

function AddPromoCode() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch active promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get(`${backend_url}/activepromocodes`);
        console.log(response.data);
        setPromoCodes(response.data);
      } catch (error) {
        setError("Failed to fetch promo codes.");
      }
    };

    fetchPromoCodes();
  }, []);

  // Add new promo code
  const handleAddPromoCode = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code || !discountPercentage || !validUntil) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`${backend_url}/addpromocode`, {
        code,
        discountPercentage: parseFloat(discountPercentage),
        validUntil,
      });
      setPromoCodes([...promoCodes, response.data.promoCode]);
      setSuccess("Promo code added successfully.");
      setCode("");
      setDiscountPercentage("");
      setValidUntil("");
    } catch (error) {
      setError("Failed to add promo code.");
    }
  };

  // Disable a promo code
  const handleDisablePromoCode = async (promoCodeId) => {
    try {
      console.log(promoCodeId);
      await axios.post(`${backend_url}/disablepromocode`, { id: promoCodeId });
      setPromoCodes(promoCodes.filter((promo) => promo._id !== promoCodeId));
    } catch (error) {
      setError("Failed to disable promo code.");
    }
  };

  return (
    <div className="addpromocode-container">
      <h2>Add New Promo Code</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="addpromocode-form" onSubmit={handleAddPromoCode}>
        <div className="form-group">
          <label htmlFor="code">Promo Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discountPercentage">Discount Percentage:</label>
          <input
            type="number"
            id="discountPercentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            min="0"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="validUntil">Valid Until:</label>
          <input
            type="date"
            id="validUntil"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="addpromocode-btn">
          Add Promo Code
        </button>
      </form>

      <h2>Active Promo Codes</h2>
      <table className="promocodes-table">
        <thead>
          <tr>
            <th>Promo Code</th>
            <th>Discount</th>
            <th>Valid Until</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((promo) => (
            <tr key={promo._id}>
              <td>{promo.code}</td>
              <td>{promo.discountPercentage}%</td>
              <td>{new Date(promo.validUntil).toLocaleDateString()}</td>
              <td>
                <button
                  className="disable-btn"
                  onClick={() => handleDisablePromoCode(promo._id)}
                >
                  Disable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddPromoCode;
