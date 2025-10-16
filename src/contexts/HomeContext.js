import React, { createContext, useState, useContext } from 'react';

// Create the context
const HomeContext = createContext();

// Create a provider component
export function HomeProvider({ children }) {
  const [homeBackground, setHomeBackground] = useState(null);

  // Function to update the background image
  const updateHomeBackground = (imageUrl) => {
    setHomeBackground(imageUrl);
  };

  // The value object that will be provided to consumers
  const value = {
    homeBackground,
    updateHomeBackground
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
}

// Create a custom hook for using this context
export function useHomeContext() {
  return useContext(HomeContext);
}