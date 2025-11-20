import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from './context/CurrencyContext';
import PropTypes from 'prop-types';
import './Landing.css';

const HeaderNavbar = ({ cart = [] }) => {
  const { 
    currency, 
    changeCurrency, 
    language, 
    changeLanguage,
    getCurrencySymbol 
  } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const currencies = [
    { code: 'INR', name: `₹ INR` },
    { code: 'USD', name: `$ USD` },
    { code: 'EUR', name: `€ EUR` },
    { code: 'GBP', name: `£ GBP` },
    { code: 'JPY', name: `¥ JPY` }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const handleCurrencySelect = (cur) => {
    changeCurrency(cur);
    setShowCurrencyDropdown(false);
  };

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false);
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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
        <h2 className="le">The Luxe Estate</h2>
      </header>
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn" onClick={() => scrollToSection('men')}>
            Shop Men
          </button>
          <button className="nav-btn" onClick={() => scrollToSection('women')}>
            Shop Women
          </button>
          <Link to="/contactus" className="nav-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
            Contact Us
          </Link>
        </div>
        <div className="nav-controls">
          <div className="dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCurrencyDropdown(!showCurrencyDropdown);
              }}
            >
              {getCurrencySymbol()} {currency} ▼
            </button>
            {showCurrencyDropdown && (
              <ul className="dropdown-menu">
                {currencies.map((curr) => (
                  <li 
                    key={curr.code} 
                    onClick={() => handleCurrencySelect(curr.code)}
                    className={currency === curr.code ? 'active' : ''}
                  >
                    {curr.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLanguageDropdown(!showLanguageDropdown);
              }}
            >
              {language} ▼
            </button>
            {showLanguageDropdown && (
              <ul className="dropdown-menu">
                {languages.map((lang) => (
                  <li 
                    key={lang.code} 
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={language === lang.code ? 'active' : ''}
                  >
                    {lang.name}
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
  cart: PropTypes.array,
};

export default HeaderNavbar;