import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import React from "react";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import Services from './pages/Services/Services';
import Schemes from "./pages/Schemes/Schemes";
import TransportDashboard from './pages/dash-tport/transdash';
import TransportBooking from './pages/dash-tport/transportbooking';
import MyTransports from './pages/dash-tport/MyTransports';
import TransportDetail from './pages/dash-tport/TransportDetail';
import SharedGoods from './pages/dash-tport/SharedGoods';
import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddRental from "./pages/AddRental/AddRental";
import SchemeDetails from "./pages/SchemeDetails/SchemeDetails";

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
<ThemeProvider>
  <Router>
    <Routes>
      {/* Routes WITH Navbar */}
      <Route element={<LayoutWithNavbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/services" element={<Services />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-transports" element={<MyTransports />} />
        <Route
          path="/transport-detail/:driverId"
          element={<TransportDetail />}
        />
        <Route
          path="/transport-dashboard"
          element={<TransportDashboard />}
        />
        <Route
          path="/book-transport"
          element={<TransportBooking />}
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/add-rental" element={<AddRental />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
      </Route>

      {/* Routes WITHOUT Navbar */}
      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />
    </Routes>
  </Router>
</ThemeProvider>
  );
}

export default App;