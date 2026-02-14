import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BooksProvider } from "./context/BooksContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BooksProvider>
        <App />
      </BooksProvider>
    </AuthProvider>
  </React.StrictMode>,
);

//Mock per aquest fitxer
console.log("main.jsx - Entry point de l'aplicació");
