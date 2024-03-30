import React, { createContext, useContext, useState } from "react";

// Define a type for the context value
type AppContextType = {
  isDarkMode: boolean;
  selectedRoute: string;
  toggleTheme: () => void;
  handleRouteChange: (route: string) => void;
};

// Use the type when creating the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: any }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("forecast");

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
  };

  const contextValue: AppContextType = {
    isDarkMode,
    selectedRoute,
    toggleTheme,
    handleRouteChange,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
