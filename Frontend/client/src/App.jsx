import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

import TransportDashboard from './pages/dash-tport/transdash';
import TransportBooking from './pages/dash-tport/transportbooking';
import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/ProductDetails/ProductDetails";



import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />



        <Route path="/login" element={<Login />} />

        <Route path="/transport-dashboard" element={<TransportDashboard/>}/>
        <Route path="/book-transport" element={<TransportBooking/>}/>

        <Route path="/product/:id" element={<ProductDetails />} />


        <Route path="/register" element={<Register />} />

 
      </Routes>
    </Router>
  );
}

export default App;