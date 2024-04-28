import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordProvider } from "./contexts/RecordContext";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RecordProvider>
          <App />
        </RecordProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
