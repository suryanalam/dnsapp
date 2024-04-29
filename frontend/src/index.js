import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordProvider } from "./contexts/RecordContext";
import { BaseUrlProvider } from "./contexts/BaseUrlContext";

import "./index.css";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BaseUrlProvider>
        <AuthProvider>
          <RecordProvider>
            <App />
          </RecordProvider>
        </AuthProvider>
      </BaseUrlProvider>
    </BrowserRouter>
  </React.StrictMode>
);
