import React, { createContext, useState } from 'react';

// Create a Context
const NavContext = createContext();

// Create a Provider component
const NavProvider = ({ children }) => {
  const [value, setValue] = useState(0);

  return (
    <NavContext.Provider value={{ value, setValue }}>
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavProvider };
