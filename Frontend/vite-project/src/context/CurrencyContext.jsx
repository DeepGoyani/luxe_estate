import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');
  const [conversionRates, setConversionRates] = useState({
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.8,
    INR: 1
  });

  // Load saved preferences from localStorage on initial render
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Save preferences to localStorage when they change
  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    // Here you would typically update i18n language as well
  };

  // Format price based on selected currency
  const formatPriceINR = (priceInINR) => {
    const rate = conversionRates[currency] || 1;
    const convertedPrice = priceInINR * rate;
    
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥'
    }[currency] || '₹';
  };

  return (
    <CurrencyContext.Provider 
      value={{
        currency,
        changeCurrency,
        language,
        changeLanguage,
        formatPriceINR,
        getCurrencySymbol,
        conversionRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
