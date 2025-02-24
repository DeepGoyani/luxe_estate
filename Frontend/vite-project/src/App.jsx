import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainComponent from "./MainComponent";
import Cart from "./assets/Cart/Cart";
import ContactPage from "./assets/Contactus/ContactUs";
import LuxuryAuth from "./Signin/LuxuryAuth";
import TshirtCollection from "./assets/T-Shirt/T-Shirt";
import ShirtCollection from "./assets/Shirt/Shirt";
import ExclusiveProducts from "./assets/Exclusive/Exclusive";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/contactus" element={<ContactPage/>}/>
        <Route path="/signin" element={<LuxuryAuth/>}/>
        <Route path="/tshirt" element={<TshirtCollection/>}/>
        <Route path="/shirt" element={<ShirtCollection/>}/>
        <Route path="/exclusive" element={<ExclusiveProducts/>  }/>


      </Routes>
    </Router>
  );
};

export default App;
