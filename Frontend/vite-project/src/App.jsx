import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import MainComponent from "./MainComponent";
import Cart from "./assets/Cart/Cart";
import ContactPage from "./assets/Contactus/ContactUs";
import LuxuryAuth from "./Signin/LuxuryAuth";
import TshirtCollection from "./assets/T-Shirt/T-Shirt";
import ShirtCollection from "./assets/Shirt/Shirt";
import TrousersCollection from "./assets/Trousers/Trousers";
import ExclusiveProducts from "./assets/Exclusive/Exclusive";
import Mens from "./assets/Mens/Mens";
import Womens from "./assets/Womens/Womens";
import HeaderNavbar from "./HeaderNavbar";
import Footer from "./Footer";
import './assets/GenderCollection/GenderCollection.css';

const App = () => {
  const [cart, setCart] = useState([]);

  // You might want to fetch the cart from your API here
  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/api/cart");
  //       setCart(response.data.items || []);
  //     } catch (error) {
  //       console.error("Error fetching cart:", error);
  //     }
  //   };
  //   fetchCart();
  // }, []);

  return (
    <Router>
      <HeaderNavbar cart={cart} />
      <main>
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contactus" element={<ContactPage />} />
          <Route path="/signin" element={<LuxuryAuth />} />
          <Route path="/tshirt" element={<TshirtCollection />} />
          <Route path="/shirt" element={<ShirtCollection />} />
          <Route path="/trousers" element={<TrousersCollection />} />
          <Route path="/exclusive" element={<ExclusiveProducts />} />
          <Route path="/men" element={<Mens />} />
          <Route path="/women" element={<Womens />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
