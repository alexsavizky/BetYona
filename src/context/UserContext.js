import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved user data
    const savedUser = localStorage.getItem("user");
    const expiration = localStorage.getItem("authExpiration");
    const currentTime = new Date().getTime();

    // If user exists and has not expired, return saved user
    if (savedUser && expiration && currentTime < Number(expiration)) {
      return JSON.parse(savedUser);
    }

    // Otherwise, clear any stale data and return null
    localStorage.removeItem("user");
    localStorage.removeItem("authExpiration");
    return null;
  });

  useEffect(() => {
    if (user) {
      // Set expiration time for 5 hours from now
      const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours in milliseconds
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authExpiration", expirationTime.toString());
    } else {
      // Clear user data when logged out
      localStorage.removeItem("user");
      localStorage.removeItem("authExpiration");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
