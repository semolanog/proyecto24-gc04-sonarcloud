
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";

// styles
import "bootstrap/scss/bootstrap.scss";
import "assets/scss/paper-kit.scss?v=1.3.0";
// pages
import Index from "views/pages/Index.js";
import IndexInicio from "views/pages/Index-Inicio.js";
import Registro from "views/pages/Registro.js";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/index" element={<Index />} />
      <Route path="/index-inicio" element={<IndexInicio />} />
      <Route path="*" element={<Navigate to="/index" replace />} />
      <Route path="/registro" element={<Registro />} />

    </Routes>
  </BrowserRouter>
);
