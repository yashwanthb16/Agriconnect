import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import React from "react";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
<<<<<<< HEAD
=======
import Register from './pages/Register';
import Services from './pages/Services/Services';
import Schemes from "./pages/Schemes/Schemes";
>>>>>>> origin/main
import TransportDashboard from './pages/dash-tport/transdash';
import TransportBooking from './pages/dash-tport/transportbooking';
import MyTransports from './pages/dash-tport/MyTransports';
import TransportDetail from './pages/dash-tport/TransportDetail';
import SharedGoods from './pages/dash-tport/SharedGoods';
import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
<<<<<<< HEAD
import AdminDashboard from './pages/Admin/AdminDashboard';
import Register from './pages/Register';
=======
import AddRental from "./pages/AddRental/AddRental";
import SchemeDetails from "./pages/SchemeDetails/SchemeDetails";
>>>>>>> origin/main

// Layout component with Navbar for most pages
function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
<<<<<<< HEAD
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Routes WITH Navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-transports" element={<MyTransports />} />
            <Route path="/transport-detail/:driverId" element={<TransportDetail />} />
            <Route path="/transport-dashboard" element={<TransportDashboard/>}/>
            <Route path="/book-transport" element={<TransportBooking/>}/>
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Routes WITHOUT Navbar (have their own layout) */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
=======
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/services" element={<Services />} />


        <Route path="/schemes" element={<Schemes />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transport-dashboard" element={<TransportDashboard/>}/>
        <Route path="/book-transport" element={<TransportBooking/>}/>

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/add-rental" element={<AddRental />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />

        <Route path="/register" element={<Register />} />

 
      </Routes>
    </Router>
>>>>>>> origin/main
  );
}

export default App;