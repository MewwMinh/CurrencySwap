import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CurrencySwap from "./CurrencySwap.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrencySwap />
  </StrictMode>
);
