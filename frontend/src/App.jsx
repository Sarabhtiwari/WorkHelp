import { useState } from 'react'
import Register from "./Components/Register";
import LoginPage from "./Components/LoginPage";
import Home from "./Components/Home";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
