import { useState, useEffect } from "react";
import axios from "axios";
import HeaderNavbar from "../../HeaderNavbar";
import Footer from "../../Footer";
import { useCurrency } from "../../context/CurrencyContext.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPriceINR } = useCurrency();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cart");
      setCartItems(response.data.items || []);
      console.log('Fetched Cart Items:', response.data.items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!id) {
      console.error("Product ID is undefined!");
      return;
    }

    console.log(`Updating quantity for productId: ${id}, New Quantity: ${quantity}`);

    if (quantity < 1) return removeItem(id);

    try {
      await axios.patch(`http://localhost:3000/api/cart/${id}`, { quantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <>
        <HeaderNavbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="page-loader">
              <div className="luxe-ring">
                <div className="luxe-initials">LE</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderNavbar />
      <div className="cart-page">
        <div className="cart-hero">
          <div className="cart-hero-content">
            <h1>Cart</h1>
            <div className="breadcrumbs">
              <span>Home</span>
              <span className="separator">&gt;</span>
              <span>Cart</span>
            </div>
          </div>
        </div>

        <div className="cart-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {cartItems.length > 0 ? (
            <div className="cart-content">
              <div className="cart-items-section">
                <div className="cart-table">
                  <div className="cart-table-header">
                    <div className="col-product">Product</div>
                    <div className="col-price">Price</div>
                    <div className="col-quantity">Quantity</div>
                    <div className="col-subtotal">Subtotal</div>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.productId || item._id} className="cart-item">
                      <div className="col-product">
                        <img 
                          src={item.image || 'https://via.placeholder.com/80x80/f5f3f0/3a3a3a?text=Product'} 
                          alt={item.name} 
                          className="product-image"
                        />
                        <span className="product-name">{item.name}</span>
                      </div>
                      <div className="col-price">
                        <span className="price">{formatPriceINR(item.price)}</span>
                      </div>
                      <div className="col-quantity">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-subtotal">
                        <span className="subtotal">{formatPriceINR(item.price * item.quantity)}</span>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="remove-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-totals-section">
                <div className="cart-totals">
                  <h3>Cart Totals</h3>
                  <div className="totals-row">
                    <span>Subtotal:</span>
                    <span>{formatPriceINR(calculateSubtotal())}</span>
                  </div>
                  <div className="totals-row total">
                    <span>Total:</span>
                    <span>{formatPriceINR(calculateTotal())}</span>
                  </div>
                  <button className="checkout-btn">
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <div className="empty-cart-content">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven&apos;t added any items to your cart yet.</p>
                <button className="continue-shopping-btn">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="features-section">
          <div className="features-container">
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <div className="feature-content">
                <h4>High Quality</h4>
                <p>crafted from top materials</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <div className="feature-content">
                <h4>Warranty Protection</h4>
                <p>Over 2 years</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📦</div>
              <div className="feature-content">
                <h4>Free Shipping</h4>
                <p>Order over 150 $</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎧</div>
              <div className="feature-content">
                <h4>24/7 Support</h4>
                <p>Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;