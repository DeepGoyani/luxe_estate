import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Landing.css';

const HeaderNavbar = ({ currency, setCurrency, language, setLanguage, cart }) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = React.useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false);
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

  const handleCurrencyChange = (e) => {
    setShowCurrencyDropdown(!showCurrencyDropdown);
    setCurrency(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setShowLanguageDropdown(!showLanguageDropdown);
    setLanguage(e.target.value);
  };

  return (
    <div className="header-navbar">
      <header className="header">
        <h1 className="le">The Luxe Estate</h1>
      </header>

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

          <Link to="/cart" className="cart-btn">🛒 ({cart ? cart.length : 0})</Link>
        </div>
      </nav>
    </div>
  );
};

HeaderNavbar.propTypes = {
  currency: PropTypes.string,
  setCurrency: PropTypes.func.isRequired,
  language: PropTypes.string,
  setLanguage: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
};

HeaderNavbar.defaultProps = {
  currency: 'INR',
  language: 'English',
};

export default HeaderNavbar;