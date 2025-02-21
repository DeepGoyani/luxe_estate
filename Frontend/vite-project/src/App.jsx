import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainComponent from "./MainComponent";
import Cart from "./assets/Cart/Cart";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
    </Router>
  );
};

export default App;
