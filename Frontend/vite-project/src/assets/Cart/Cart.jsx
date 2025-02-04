import  { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart");
      console.log("Cart API Response:", response.data); // Debugging log
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post("http://localhost:5000/cart/add", {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      fetchCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:5000/cart/update/${itemId}`, {
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/cart/clear");
      fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Ensure price and quantity exist before using toLocaleString()
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <h2>{item.name}</h2>
              <p>Price: Rs. {item.price ? item.price.toLocaleString() : "N/A"}</p>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}>
                  -
                </button>
                <span>{item.quantity || 0}</span>
                <button onClick={() => handleQuantityChange(item._id, (item.quantity || 0) + 1)}>
                  +
                </button>
              </div>
              <p>Subtotal: Rs. {item.price && item.quantity ? (item.price * item.quantity).toLocaleString() : "N/A"}</p>
              <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <h2>Cart Total: Rs. {subtotal ? subtotal.toLocaleString() : "0"}</h2>
        <button onClick={handleClearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
export default Cart;