import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/Cart/Cart.css'
import CartPage from './assets/Cart/Cart';
import LuxeEstate from './Landing';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LuxeEstate/>} />
            <Route path="/cart" element={<CartPage/>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;