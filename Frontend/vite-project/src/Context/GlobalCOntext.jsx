import { createContext, useState, useContext } from "react";

// Create the context
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");

  return (
    <GlobalContext.Provider value={{ currency, setCurrency, language, setLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for easy access
export const useGlobalContext = () => useContext(GlobalContext);
