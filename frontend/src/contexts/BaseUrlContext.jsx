import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";

let cachedBaseUrl = null;
export const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    async function fetchBaseUrl() {
      if (!cachedBaseUrl) { 
        try {
          const response = await axios.get('https://dnsapp-iulk.onrender.com/api/getBaseUrl');
          cachedBaseUrl = response.data.baseUrl;
          setBaseUrl(cachedBaseUrl);
        } catch (error) {
          console.error('Error fetching base URL:', error);
        }
      }
    }
    fetchBaseUrl();
  }, []);

  return (
    <BaseUrlContext.Provider value={{ baseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};
