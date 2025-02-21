// HeaderNavbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Landing.css';

const HeaderNavbar = ({ currency = 'INR', setCurrency, language = 'English', setLanguage, cart }) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

  const handleCurrencySelect = (cur) => {
    setCurrency(cur);
    setShowCurrencyDropdown(false);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowCurrencyDropdown(false);
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
            <button onClick={(e) => {
              e.stopPropagation();
              setShowCurrencyDropdown(!showCurrencyDropdown);
            }}>
              {currency} ▼
            </button>
            {showCurrencyDropdown && (
              <ul className="dropdown-menu">
                {currencies.map((cur) => (
                  <li key={cur} onClick={() => handleCurrencySelect(cur)}>
                    {cur}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="dropdown">
            <button onClick={(e) => {
              e.stopPropagation();
              setShowLanguageDropdown(!showLanguageDropdown);
            }}>
              {language} ▼
            </button>
            {showLanguageDropdown && (
              <ul className="dropdown-menu">
                {languages.map((lang) => (
                  <li key={lang} onClick={() => handleLanguageSelect(lang)}>
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link to="/cart" className="cart-btn">
            🛒 ({cart?.length || 0})
          </Link>
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
  cart: PropTypes.array
};

export default HeaderNavbar;