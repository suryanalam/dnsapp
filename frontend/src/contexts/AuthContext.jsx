import React from "react";
import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({});

  return (
    <AuthContext.Provider value={{ loginInfo, setLoginInfo }}>
      {children}
    </AuthContext.Provider>
  );
};