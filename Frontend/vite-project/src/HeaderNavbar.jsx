import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'

const HeaderNavbar = ({ cart = [] }) => {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

  return (
    <header>
      <h1 className="le">The Luxe Estate</h1>
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn">Shop Men</button>
          <button className="nav-btn">Shop Women</button>
          <button className="nav-btn">Contact Us</button>
        </div>

        <div className="nav-controls">
          <div className="dropdown">
            <button onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
              {currency} ▼
            </button>
            {showCurrencyDropdown && (
              <ul className="dropdown-menu">
                {currencies.map((cur) => (
                  <li key={cur} onClick={() => setCurrency(cur)}>
                    {cur}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown">
            <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              {language} ▼
            </button>
            {showLanguageDropdown && (
              <ul className="dropdown-menu">
                {languages.map((lang) => (
                  <li key={lang} onClick={() => setLanguage(lang)}>
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/cart" className="cart-btn">🛒 ({cart.length})</Link>
        </div>
      </nav>
    </header>
  );
};

export default HeaderNavbar;
