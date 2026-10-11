import React from "react";
import { createRoot } from "react-dom/client";
import { About } from "./About.jsx";
import "../styles.css";
import "./about.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <About />
  </React.StrictMode>,
);
