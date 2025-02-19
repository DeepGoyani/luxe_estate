import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import './assets/Cart/Cart.css'
import CartPage from './assets/Cart/Cart';
import LuxeEstate from './Landing';
import MainComponent from './MainComponent';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';


function App() {
  return (
    // <Router>


        <main>
          <HeaderNavbar/>
          <MainComponent/>
          <Footer/>
          {/* <Routes>
            <Route path="/" element={<LuxeEstate/>} />
            <Route path="/cart" element={<CartPage/>} />
          </Routes> */}
        </main>

      
    // </Router>
  );
}

export default App;