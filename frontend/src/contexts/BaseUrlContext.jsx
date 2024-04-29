import React, { createContext, useState} from 'react';
export const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [baseUrl, setBaseUrl] = useState("https://dnsapp-iulk.onrender.com");

  return (
    <BaseUrlContext.Provider value={{ baseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};
